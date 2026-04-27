import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

const databaseUrl = process.env.DATABASE_URL ? env('DATABASE_URL') : undefined;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  ...(databaseUrl ? { datasource: { url: databaseUrl } } : {}),
});
