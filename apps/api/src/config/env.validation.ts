import { z } from 'zod';

/**
 * Environment contract for the API. Validated once at boot via
 * `ConfigModule.forRoot({ validate })` so a misconfigured process fails fast
 * with an actionable error instead of blowing up on first use.
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  // Supabase Postgres (Prisma).
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  // Supabase Auth / API.
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(1),

  // Cloudflare R2 (S3-compatible object storage). Optional so the app boots
  // without them; the media endpoint fails clearly if they are missing.
  R2_ACCOUNT_ID: z.string().min(1).optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  R2_BUCKET: z.string().min(1).optional(),
  // Public base URL for reads (r2.dev or a custom domain), no trailing slash.
  R2_PUBLIC_BASE_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }

  return parsed.data;
}
