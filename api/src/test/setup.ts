import { afterAll, beforeAll, beforeEach } from 'vitest';
import { cleanupTestDatabase, setupTestDatabase, teardownTestDatabase } from './db-setup';

// Setup test database before all tests
beforeAll(async () => {
  await setupTestDatabase();
});

// Clean database between tests
beforeEach(async () => {
  await cleanupTestDatabase();
});

// Teardown after all tests
afterAll(async () => {
  await teardownTestDatabase();
});
