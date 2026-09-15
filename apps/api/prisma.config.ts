import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Prisma 7 configuration. The CLI (migrate/studio) uses the direct connection
// (:5432); the app runtime connects via the pg driver adapter in
// src/prisma/prisma.service.ts using the pooled DATABASE_URL.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DIRECT_URL'),
  },
});
