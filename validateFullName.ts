export const FULL_NAME_MIN = 2;
export const FULL_NAME_MAX = 50;

export const FULL_NAME_ERRORS = {
  required: "Full name is required",
  tooShort: "Full name must be at least 2 characters",
  tooLong: "Full name must not exceed 50 characters",
  invalid: "Full name contains invalid characters",
} as const;

// Letters (any script), combining marks, spaces, hyphens, apostrophes, dots.
const ALLOWED = /^[\p{L}\p{M} .'’-]+$/u;

/** Trims ends and collapses consecutive whitespace into a single space. */
export function normalizeFullName(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

export interface FullNameResult {
  value: string; // normalized value
  error: string | null;
}

export function validateFullName(raw: string): FullNameResult {
  const value = normalizeFullName(raw);
  const length = [...value].length; // count code points, not UTF-16 units

  let error: string | null = null;
  if (length === 0) error = FULL_NAME_ERRORS.required;
  else if (length < FULL_NAME_MIN) error = FULL_NAME_ERRORS.tooShort;
  else if (length > FULL_NAME_MAX) error = FULL_NAME_ERRORS.tooLong;
  else if (!ALLOWED.test(value)) error = FULL_NAME_ERRORS.invalid;

  return { value, error };
}
