import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
    exclude: ['node_modules', 'dist', '**/*.config.ts'],
    hookTimeout: 30000,
    env: {
      DATABASE_URL: 'postgresql://postgres:localdev@localhost:5432/gym_test',
      NODE_ENV: 'test',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.config.ts', 'dist/', 'prisma/'],
    },
  },
});
