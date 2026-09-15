import axios from 'axios';

import {
  createUploadSchema,
  uploadContentTypeSchema,
  uploadTargetSchema,
  type UploadContentType,
  type UploadFolder,
} from '@repo/contracts';

import { api } from '@/shared/lib/api';

/** Largest file we allow through the presigned-upload flow (5 MB). */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Human-friendly labels for the accepted content types (for error messages). */
const CONTENT_TYPE_LABELS: Record<UploadContentType, string> = {
  'image/svg+xml': 'SVG',
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/webp': 'WebP',
};

/** `accept` attribute value for an `<input type="file">` limited to allowed types. */
export const UPLOAD_ACCEPT = uploadContentTypeSchema.options.join(',');

export type UploadOptions = {
  /** Reports upload progress as a 0–1 fraction (only fires when the size is known). */
  onProgress?: (fraction: number) => void;
  /** Overrides the default max size in bytes. */
  maxBytes?: number;
};

/**
 * Validates a file against the accepted content types and size limit. Returns an
 * error message if the file is rejected, or `null` when it is acceptable. Use this
 * for inline field validation before calling {@link uploadFile}.
 */
export function validateUploadFile(
  file: File,
  maxBytes: number = MAX_UPLOAD_BYTES,
): string | null {
  if (!uploadContentTypeSchema.safeParse(file.type).success) {
    const allowed = uploadContentTypeSchema.options
      .map((type) => CONTENT_TYPE_LABELS[type])
      .join(', ');
    return `Unsupported file type. Allowed: ${allowed}.`;
  }

  if (file.size > maxBytes) {
    const megabytes = Math.round(maxBytes / (1024 * 1024));
    return `File is too large. Maximum size is ${megabytes} MB.`;
  }

  return null;
}

/**
 * Uploads a file to object storage via a presigned URL and returns its public URL.
 *
 * 1. validates the file (throws a friendly `Error` on rejection),
 * 2. asks the API for a presigned R2 target,
 * 3. PUTs the file straight to R2 with a bare axios call (the shared `api`
 *    instance must not be used — R2 is a different origin and would choke on the
 *    bearer header + response-envelope interceptor),
 * 4. returns `publicUrl` to persist (e.g. as a category `iconPath`).
 */
export async function uploadFile(
  file: File,
  folder: UploadFolder,
  options: UploadOptions = {},
): Promise<string> {
  const validationError = validateUploadFile(file, options.maxBytes ?? MAX_UPLOAD_BYTES);
  if (validationError) {
    throw new Error(validationError);
  }

  const contentType = file.type as UploadContentType;
  const body = createUploadSchema.parse({ contentType, folder });

  const { data } = await api.post('/v1/media/uploads', body);
  const target = uploadTargetSchema.parse(data);

  await axios.put(target.uploadUrl, file, {
    headers: { 'Content-Type': contentType },
    onUploadProgress: (event) => {
      if (options.onProgress && event.total) {
        options.onProgress(event.loaded / event.total);
      }
    },
  });

  return target.publicUrl;
}

/**
 * Uploads several files to the same folder in parallel, resolving to their public
 * URLs in the original order. Any single failure rejects the whole batch.
 */
export function uploadFiles(
  files: File[],
  folder: UploadFolder,
  options: UploadOptions = {},
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadFile(file, folder, options)));
}
