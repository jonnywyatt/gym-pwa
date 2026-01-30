# Prisma


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

### Error Handling

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

### Transactions

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

### Indexes

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
