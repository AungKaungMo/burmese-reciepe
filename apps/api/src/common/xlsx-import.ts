import { BadRequestException } from '@nestjs/common';
import type { ImportError, ImportResult } from '@repo/contracts';
import type { output, ZodError, ZodType } from 'zod';
import XLSX from 'xlsx';
import { Prisma } from '../generated/prisma/client.js';

/** Minimal shape of a multer memory-storage upload (avoids an @types/multer dep). */
export interface UploadedXlsx {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

/** Max import file size (5 MB), for `FileInterceptor` limits. */
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

/** Validates an uploaded xlsx (present + .xlsx/.xls) and returns its buffer, or 400s. */
export function requireXlsxBuffer(file?: UploadedXlsx): Buffer {
  if (!file) {
    throw new BadRequestException('No file uploaded. Attach an .xlsx file as "file".');
  }
  const name = file.originalname?.toLowerCase() ?? '';
  if (!name.endsWith('.xlsx') && !name.endsWith('.xls')) {
    throw new BadRequestException('Unsupported file type. Upload an .xlsx spreadsheet.');
  }
  return file.buffer;
}

export interface XlsxImportOptions<S extends ZodType> {
  /** Maps one raw sheet row (header → cell) to a candidate payload, not yet validated. */
  rowToInput: (raw: Record<string, unknown>) => unknown;
  /** Zod schema that validates + coerces the candidate into the create payload. */
  schema: S;
  /** Persists one validated row. Runs independently per row. */
  createOne: (input: output<S>) => Promise<unknown>;
  /** Optional check run before schema validation; return an error message to reject the row. */
  preValidate?: (candidate: unknown) => string | null;
  /** Pulls a human-friendly row identifier for error reports (defaults to `code`/`slug`). */
  identify?: (candidate: unknown) => string | null;
  /** Message used when a row hits a unique-constraint (P2002) conflict. */
  onConflictMessage?: string;
}

/**
 * Generic xlsx bulk-import: parse the first sheet, then validate + create each row
 * independently so one bad row never aborts the rest. Invalid/duplicate rows are
 * collected into the returned {@link ImportResult}. Entity modules supply only their
 * row mapper, schema, and create function.
 *
 * The generic is parameterized on the schema type `S` (like `ZodValidationPipe`) so
 * `.safeParse` binds directly and avoids TS2589 on deep schemas.
 */
export async function importRowsFromXlsx<S extends ZodType>(
  buffer: Buffer,
  options: XlsxImportOptions<S>,
): Promise<ImportResult> {
  const {
    rowToInput,
    schema,
    createOne,
    preValidate,
    identify = defaultIdentify,
    onConflictMessage,
  } = options;

  let rows: Record<string, unknown>[];
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error('No sheet found.');
    rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {
      defval: '',
    });
  } catch {
    throw new BadRequestException('Could not read the spreadsheet. Upload a valid .xlsx file.');
  }

  const errors: ImportError[] = [];
  let created = 0;

  for (let index = 0; index < rows.length; index++) {
    const candidate = rowToInput(rows[index]);
    // +1 for the header row, +1 to make it 1-based, matching what the user sees.
    const rowNumber = index + 2;
    const identifier = identify(candidate);

    const preError = preValidate?.(candidate);
    if (preError) {
      errors.push({ row: rowNumber, code: identifier, message: preError });
      continue;
    }

    const parsed = schema.safeParse(candidate);
    if (!parsed.success) {
      errors.push({ row: rowNumber, code: identifier, message: formatIssues(parsed.error) });
      continue;
    }

    try {
      await createOne(parsed.data);
      created++;
    } catch (error) {
      errors.push({ row: rowNumber, code: identifier, message: rowErrorMessage(error, onConflictMessage) });
    }
  }

  return { total: rows.length, created, failed: errors.length, errors };
}

function defaultIdentify(candidate: unknown): string | null {
  if (candidate && typeof candidate === 'object') {
    const record = candidate as Record<string, unknown>;
    for (const key of ['code', 'slug']) {
      const value = record[key];
      if (typeof value === 'string' && value) return value;
    }
  }
  return null;
}

function formatIssues(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.') || '(row)'}: ${issue.message}`)
    .join('; ');
}

function rowErrorMessage(error: unknown, onConflictMessage?: string): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return onConflictMessage ?? 'A record with these values already exists.';
  }
  return error instanceof Error ? error.message : 'Failed to create the row.';
}
