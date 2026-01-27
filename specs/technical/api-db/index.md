# Remote Database Technical Specification

## Overview

This document covers the **server-side database** setup using:
- **Prisma** - Type-safe ORM for defining schema and querying data
- **Railway PostgreSQL** - Fully-managed PostgreSQL database
- **Express API** - RESTful API server

**Important:** This is separate from the **client-side IndexedDB** (covered in [offline-technical.md](./offline-technical.md)). See architecture diagram below.

See also: 
[Technology choices](./tech-choices.md)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Browser (Client-side)                                   │
│                                                         │
│  Vue App ──→ Dexie.js ──→ IndexedDB                    │
│                                                         │
│  Purpose: Offline workout data during active session    │
│  Schema: Defined in TypeScript with Dexie             │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTP (when online)
                         │ Sync at workout start/finish
                         │
┌────────────────────────▼────────────────────────────────┐
│ Railway (Server-side)                                   │
│                                                         │
│  Express API ──→ Prisma Client ──→ PostgreSQL          │
│                                                         │
│  Purpose: Persistent storage of all user data          │
│  Schema: Defined in Prisma Schema Language             │
└─────────────────────────────────────────────────────────┘
```

## Why You Need Both

### Server-side (Prisma + Railway PostgreSQL)
- ✅ Permanent storage of all workouts, routines, records
- ✅ Multi-device sync
- ✅ Data backup and recovery (automatic with Railway)
- ✅ Cross-user features (leaderboards, sharing - future)
- ✅ Rich queries and analytics

### Client-side (Dexie + IndexedDB)
- ✅ Offline capability during workouts
- ✅ Instant feedback (no network latency)
- ✅ Temporary storage during active workout
- ✅ Queue failed syncs

**They work together:** Client syncs to/from server at workout start/finish.

## Prisma Setup

### 1. Install Dependencies

```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema definition
- `.env` - Environment variables (DATABASE_URL)

### 3. Configure Environment

Update `api/.env`:

```bash
# Railway PostgreSQL connection string (from Railway dashboard)
DATABASE_URL="postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway"
```

Railway provides this connection string automatically when you add a PostgreSQL service. It includes SSL by default.

## Prisma Schema

### Complete Schema Definition

See [schema.prisma](code/schema.prisma) for the complete database schema with:

**Tables:**
- `User` - User authentication and profile
- `Exercise` - Exercise library (seeded + user-created)
- `Routine` / `RoutineExercise` - Workout routines
- `Workout` / `WorkoutSet` - Completed workouts with sets
- `PersonalRecord` - Personal bests per exercise
- `BodyweightHistory` - Weight tracking over time

**Key features:**
- JSON fields for flexible data (muscle groups, routine snapshots)
- Cascade deletes for data integrity
- Indexes on frequently queried fields
- Decimal precision for weights

### 4. Generate Prisma Client

```bash
# Generate TypeScript types and client
npx prisma generate

# Push schema to database (creates/updates tables)
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate dev --name init
```

Add to `package.json`:

```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "build": "prisma generate && vite build",
    "postinstall": "prisma generate"
  }
}
```

## Using Prisma in Express API

### Prisma Client Setup

See [prisma-client.ts](code/prisma-client.ts) for the singleton Prisma client setup with:
- Connection reuse across requests (prevents connection pool exhaustion)
- Development logging (queries, errors, warnings)
- Graceful shutdown handling

### Example: Auth Route

See [auth-route.ts](code/auth-route.ts) for the complete authentication route with:
- OAuth code exchange with Google
- ID token verification
- User upsert (find or create)
- JWT generation (access + refresh tokens)

Configuration file location: `api/src/routes/auth.ts`

### Express API Structure

See [index.ts](code/index.ts) for the complete Express server entry point with:
- CORS configuration
- JSON body parsing
- Health check endpoint
- Route mounting (auth, workouts, routines, records)
- Error handling middleware
- Server startup

Configuration file location: `api/src/index.ts`

### Authentication Middleware

See [middleware-auth.ts](code/middleware-auth.ts) for the complete JWT authentication middleware with:
- Bearer token validation
- JWT verification with secret
- Request user typing
- Proper error responses (401 for missing/invalid tokens)

Configuration file location: `api/src/middleware/auth.ts`

### Complete Workouts Route Example

See [routes-workouts.ts](code/routes-workouts.ts) for a production-ready workouts route with:
- Authentication middleware
- GET /api/workouts - List user's workouts with pagination and includes
- POST /api/workouts - Save completed workout with sets in a transaction
- DELETE /api/workouts/:id - Delete a workout with ownership verification
- Proper error handling throughout

Configuration file location: `api/src/routes/workouts.ts`

For more route examples, see the complete implementations in the `code/` directory.

### Example: Routines Route

See [routes-routines.ts](code/routes-routines.ts) for the complete routines route with:
- GET /api/routines - List seed and user-created routines
- POST /api/routines - Create new user routine
- DELETE /api/routines/:id - Delete user routine (with seed data protection)

Configuration file location: `api/src/routes/routines.ts`

### Example: Personal Records Route

See [routes-records.ts](code/routes-records.ts) for the complete personal records route with:
- GET /api/records - Fetch all personal records for authenticated user

Configuration file location: `api/src/routes/records.ts`

## Database Migrations

### Development Workflow

```bash
# Make schema changes in prisma/schema.prisma

# Create migration
npx prisma migrate dev --name add_exercise_field

# Apply to database
npx prisma migrate deploy

# Generate new Prisma Client
npx prisma generate
```

### Production Deployment

Migrations run automatically during Railway deployment:

Update `api/package.json`:

```json
{
  "scripts": {
    "build": "prisma generate",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "migrate": "prisma migrate deploy"
  }
}
```

Railway will run migrations automatically if you configure the build command in `railway.toml` or in the Railway dashboard:

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run migrate && npm start"
```

## Seeding Data

### Create Seed Script

See [seed.ts](code/seed.ts) for the complete database seed script with:
- Exercise seeding (Bench Press, Pull Up with muscle groups and form tips)
- Routine seeding (Upper Body Strength routine)
- Proper error handling and Prisma disconnection

Configuration file location: `prisma/seed.ts`

Update `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "scripts": {
    "seed": "prisma db seed"
  }
}
```

Install tsx:
```bash
npm install -D tsx
```

Run seed:
```bash
npm run seed
```

## Prisma Studio (Database GUI)

View and edit data in browser:

```bash
npx prisma studio
```

Opens at http://localhost:5555

Great for:
- Inspecting data during development
- Manual data entry
- Testing queries
- Debugging

## Type Safety Across Stack

### Generate Types for Frontend

See **[../client-app/code/database-types.ts](../client-app/code/database-types.ts)** for shared type definitions including:
- Prisma-generated types (User, Exercise, Routine, Workout, PersonalRecord)
- Frontend-specific types (WorkoutInProgress)

Configuration file location: `src/lib/types/database.ts`

Now frontend and backend share the same types!

## Best Practices

### 1. Connection Management

```typescript
// ✅ Good - Singleton pattern (reuse connection)
// api/src/utils/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// ❌ Bad - New connection per request
import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
  const prisma = new PrismaClient(); // Don't do this!
  // ...
});
```

### 2. Error Handling

```typescript
import { Prisma } from '@prisma/client';

router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Unique constraint violation' });
      }
    }

    console.error('Database error:', error);
    next(error); // Pass to Express error handler
  }
});
```

### 3. Transactions

```typescript
// Ensure atomic operations
const workout = await prisma.$transaction(async (tx) => {
  // Create workout
  const workout = await tx.workout.create({ data: workoutData });

  // Create sets
  await tx.workoutSet.createMany({
    data: sets.map(set => ({ ...set, workoutId: workout.id }))
  });

  // Update records
  await tx.personalRecord.upsert({ where, update, create });

  return workout;
});
```

### 4. Indexes

Always add indexes for:
- Foreign keys
- Query filters (WHERE clauses)
- Sort fields (ORDER BY)

Already included in schema above.

### 5. JSON Fields

Use JSON for flexible data structures:

```typescript
// Good for: Variable structure, nested data, rarely queried fields
muscleGroups: Json // { "primary": ["chest"], "secondary": ["triceps"] }

// But don't overuse - prefer relational structure when possible
```

## Environment Variables

See [.env.example](code/.env.example) for the complete list of required API environment variables with:
- `DATABASE_URL` - PostgreSQL connection string (auto-filled by Railway)
- `JWT_SECRET` - Secret key for access tokens (min 32 chars)
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens (min 32 chars)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `PORT` - Server port (default 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed frontend URL

### Local Development

Copy `.env.example` to `api/.env` and fill in your actual values.

Generate secure JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Railway Production

Railway automatically injects `DATABASE_URL` when you provision PostgreSQL.

Set all other variables from `.env.example` in Railway dashboard → Service → Variables.

## Performance Tips

### 1. Select Only What You Need

```typescript
// ❌ Fetches all fields
const users = await prisma.user.findMany();

// ✅ Select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true
  }
});
```

### 2. Limit Results

```typescript
// Always limit queries
const workouts = await prisma.workout.findMany({
  where: { userId },
  take: 50, // Limit to 50 results
  orderBy: { completedAt: 'desc' }
});
```

### 3. Use Includes Wisely

```typescript
// ✅ Include what you need
const workout = await prisma.workout.findUnique({
  where: { id },
  include: {
    workoutSets: true // Need these
  }
});

// ❌ Deep includes can be slow
const workout = await prisma.workout.findUnique({
  where: { id },
  include: {
    workoutSets: {
      include: {
        exercise: {
          include: {
            routineExercises: {
              include: { routine: true }
            }
          }
        }
      }
    }
  }
});
```

## Troubleshooting

### "Can't reach database server"
- Check DATABASE_URL is correct in Railway environment variables
- Verify Railway PostgreSQL database is running
- Check if Railway service is deployed successfully

### "Connection timeout"
- Verify Railway database and API are in the same project
- Check Railway service logs: `railway logs`
- Ensure Prisma singleton pattern is used (no new PrismaClient per request)

### "Prisma Client not generated"
- Run `npx prisma generate`
- Add to build script in package.json: `"build": "prisma generate && tsc"`

### "Migration failed"
- Check DATABASE_URL environment variable is set in Railway
- Verify database permissions
- Check for conflicting migrations in prisma/migrations folder
- Use Railway CLI: `railway run npx prisma migrate deploy`

## Summary

**Prisma Benefits:**
- ✅ Type-safe database queries
- ✅ Schema as TypeScript code
- ✅ Auto-complete in IDE
- ✅ Automatic migrations
- ✅ Works perfectly with Railway PostgreSQL + Express

**Architecture:**
- Server (Express + Prisma + Railway PostgreSQL) = Permanent storage
- Client (Dexie + IndexedDB) = Temporary offline storage
- Both work together via sync at workout start/finish

Your gym PWA now has a robust, type-safe database layer!
