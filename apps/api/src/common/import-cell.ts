/** Lowercase + trim every header key so import columns are case-insensitive. */
export function normalizeRow(row: Record<string, unknown>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[key.trim().toLowerCase()] = value == null ? '' : String(value).trim();
  }
  return normalized;
}

/** Coerces a cell to boolean, tolerating true/false, 1/0, yes/no, active/inactive. */
export function parseBoolean(value: string, fallback: boolean): boolean {
  if (!value) return fallback;
  const normalized = value.toLowerCase();
  if (['true', '1', 'yes', 'y', 'active'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n', 'inactive'].includes(normalized)) return false;
  return fallback;
}

/** Empty string → null (for nullable text columns). */
export function emptyToNull(value: string): string | null {
  return value ? value : null;
}

/** Empty string → undefined (lets a schema default apply); otherwise a Number. */
export function toOptionalNumber(value: string): number | undefined {
  return value === '' ? undefined : Number(value);
}

/** Splits a comma/newline-separated cell into a trimmed, non-empty list. */
export function toList(value: string): string[] {
  return value
    ? value
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}
