# Gym PWA API

## Database Setup

This project uses a shared Postgres Docker container for both local development and integration tests, following [Prisma's integration testing approach](https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing).

### Architecture

- **Single Docker Container**: One Postgres container (`gym-postgres`) runs on port 5432
- **Two Databases**:
  - `gym_dev` - Used for local development
  - `gym_test` - Used for integration tests
- **Docker Compose**: `docker-compose.yml` lives in the `api/` directory

### Quick Start

**The Docker container starts automatically when you run tests!** No manual setup required.

1. **Run tests** (Docker starts automatically):
   ```bash
   npm test                     # From root
   npm run test:run -w api      # API only from root
   npm run test:run             # From api/ directory
   ```

2. **Or run the API locally** (Docker must be started manually):
   ```bash
   npm run docker:up -w api     # Start Docker from root
   # OR
   cd api && npm run docker:up  # Start Docker from api/

   npm run dev -w api           # Start API
   ```

### Docker Commands

From the root directory:
```bash
# Start Postgres container
npm run docker:up -w api

# Stop container (preserves data)
npm run docker:down -w api

# View container logs
npm run docker:logs -w api
```

Or from the `api/` directory:
```bash
# Start Postgres container
npm run docker:up

# Stop container (preserves data)
npm run docker:down

# View container logs
npm run docker:logs
```

### Database Commands

```bash
# Create test database
npm run db:test:create -w api

# Drop test database
npm run db:test:drop -w api

# Reset test database (drop, create, push schema)
npm run db:test:reset -w api

# Push schema to development database
npm run prisma:push -w api

# Generate Prisma client
npm run prisma:generate -w api
```

### Testing

**Docker Compose starts automatically before tests run**, so you can just run:

```bash
# Run all tests (unit + integration) - from root
npm test

# Run all tests (unit + integration) - API only
npm run test:run -w api

# Run only integration tests
npm run test:integration -w api

# Run tests in watch mode
npm run test -w api

# Run with coverage
npm run test:coverage -w api
```

All test commands automatically:
1. Start Docker Compose (if not running)
2. Wait for Postgres to be ready
3. Create the test database (if needed)
4. Run the tests

### How Integration Tests Work

1. **Setup** (`beforeAll`): Creates/updates the test database schema
2. **Cleanup** (`beforeEach`): Truncates all tables between tests
3. **Tests**: Each test runs against a clean database
4. **Teardown** (`afterAll`): Disconnects from the database

Example integration test:

```typescript
import { describe, it, expect } from 'vitest';
import { getTestPrismaClient } from '../db-setup';

describe('My Integration Test', () => {
  it('should interact with the database', async () => {
    const prisma = getTestPrismaClient();
    
    const exercise = await prisma.exercise.create({
      data: { name: 'Test Exercise' },
    });
    
    expect(exercise.id).toBeDefined();
  });
});
```

### Environment Variables

- **Development**: Uses `api/.env` with `DATABASE_URL` pointing to `gym_dev`
- **Testing**: Uses `api/.env.test` with `DATABASE_URL` pointing to `gym_test`
- **CI**: Set `DATABASE_URL` environment variable in CI pipeline

### Troubleshooting

**Tests fail with connection errors:**
- Ensure Docker container is running: `docker ps | grep gym-postgres`
- Create test database: `npm run db:test:create -w api`
- Reset test database: `npm run db:test:reset -w api`

**Schema changes not reflected:**
- Push schema to dev: `npm run prisma:push -w api`
- Reset test DB: `npm run db:test:reset -w api`
- Regenerate client: `npm run prisma:generate -w api`
