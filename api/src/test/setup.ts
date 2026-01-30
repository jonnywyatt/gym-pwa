import { afterAll, beforeAll } from 'vitest';
import { setupTestDatabase, teardownTestDatabase } from './db-setup';

// Setup test database before all tests
beforeAll(async () => {
  await setupTestDatabase();
});

// Teardown after all tests
afterAll(async () => {
  await teardownTestDatabase();
});
