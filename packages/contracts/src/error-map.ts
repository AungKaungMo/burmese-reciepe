import { z } from 'zod';

/**
 * A global Zod error map that replaces Zod's terse default messages
 * (e.g. "Too small: expected string to have >=1 characters") with plain,
 * user-facing wording. Returning `undefined` for an issue falls back to Zod's
 * default. Imported once for its side effect (see `index.ts`), so every schema
 * in this package — on both the API and the admin — produces the same messages.
 */
const friendlyErrorMap: z.core.$ZodErrorMap = (issue) => {
  switch (issue.code) {
    case 'invalid_type':
      // A missing value surfaces as an `invalid_type` with `undefined` input.
      return issue.input === undefined ? 'This field is required.' : undefined;

    case 'too_small': {
      const min = Number(issue.minimum);
      if (issue.origin === 'string') {
        return min <= 1 ? 'This field is required.' : `Must be at least ${min} characters.`;
      }
      if (issue.origin === 'array') {
        return min <= 1 ? 'Add at least one.' : `Add at least ${min}.`;
      }
      if (issue.origin === 'number') {
        return `Must be at least ${min}.`;
      }
      return undefined;
    }

    case 'too_big': {
      const max = Number(issue.maximum);
      if (issue.origin === 'string') return `Must be at most ${max} characters.`;
      if (issue.origin === 'array') return `Add at most ${max}.`;
      if (issue.origin === 'number') return `Must be at most ${max}.`;
      return undefined;
    }

    case 'invalid_format': {
      const labels: Record<string, string> = {
        email: 'a valid email address',
        url: 'a valid URL',
        uuid: 'a valid ID',
      };
      const label = labels[issue.format] ?? `a valid ${issue.format}`;
      return `Must be ${label}.`;
    }

    default:
      return undefined;
  }
};

z.config({ customError: friendlyErrorMap });
