# Create routines

Add the ability for a user to create, edit and delete new routines composed of existing exercises. A new routine will initially be visible only to the user who created it. 

## Routines page

For any given user, the Routines page should show the public routines plus any routines that they created. 

Add a checkbox at the top of the page - 'Show recommended routines' - if checked, both the user's and the public routines will be shown (with the user's routines listed first). If Unchecked, only the user's routines will be shown. 
To remember the user's selection for 'Show recommended routines' - add a new column to the `users` table called `preferences` and set it to a JSON object with a single property called `showRecommendedRoutines` and a value of `true` or `false`. When updating be sure to read the whole object first and merge the update into it, so as not to lose any existing properties.

Next to each routine that was created by the user, add two buttons 'Edit' and 'Delete'. Delete will show the existing 'are you sure?' dialog (generalise this if required as it's already used for a different purpose). Edit will navigate the user to `/routines/:id/edit`.

At the top of the Routines page, add a button 'Create routine'.

## Create / edit routine page

When the 'Create routine' button mentioned above is clicked, a new empty routine should be created in the `routines` table. Navigate the user to the new routine at `/routines/:id/edit`. 

In the future I might add the ability for users to share routines with other users, so it makes sense that the new routines are stored in the `routines` table in the DB at this stage.

Add a new column to the `routines` table called `user_id` and for new routines set it to the current user's ID. It should have a default value of `null` so that for the two existing seeded routines that are already in the DB it will automatically be set to `null`, indicating that they are public, so visible to all users.

- Provide a name input field at the top of the page. When focus leaves the input, save the value to the new routine's record in `routines` table (to the `label` column).
- Provide a search input field at the top of the page that allows the user to search for existing exercises by name and add them to the routine one at a time. As the user types, show the matching exercises in a list of highlighted cards, including body area and muscle groups. As exercises are added, save immediately to the `routine_exercises` table.
- Next to each exercise in the routine, provide a 'Remove' button
- Provide a button 'Finish' at the top of the page, in the same row as the routine name, but right-aligned. When clicked, navigate the user to the Routines page. The routine name and exercises were already saved as they were added, so nothing to save at this point.

## Implementation

### 1. Database Changes (Prisma Schema)

**`routines` table** — add `user_id` column:
- New nullable `userId` column (FK to `users.id`), default `null`
- Existing seeded routines ("Strength", "Abs") will have `null` = public/visible to all
- The `label` column currently has a `@unique` constraint — change this to `@@unique([label, userId])`.

**`users` table** — add `preferences` JSON column:
- Stores `{ showRecommendedRoutines: boolean }`
- Read-merge-write pattern when updating

**Empty routine creation** — the `label` column is currently not nullable and has no default. Need to allow empty/default label for newly created routines.

Migration needed, then `npx prisma generate`.

### 2. API Changes

**Existing:** Only `GET /routines` and `GET /routines/:routineId` exist.

**New endpoints needed:**

| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/routines` | Create empty routine with `userId` set to current user, return `{ id }` |
| `PATCH` | `/routines/:routineId/label` | Update routine name (on blur) |
| `POST` | `/routines/:routineId/exercises` | Add exercise to routine |
| `DELETE` | `/routines/:routineId/exercises/:exerciseId` | Remove exercise from routine |
| `DELETE` | `/routines/:routineId` | Delete entire routine (cascade already configured in schema) |
| `PATCH` | `/users/:userId/preferences` | Update user preferences (merge) |
| `GET` | `/users/:userId/preferences` | Get user preferences |

**Modify existing:** `GET /routines` must be updated to filter by `userId IS NULL` (public) OR `userId = currentUser`. The `RoutineSummary` type needs a `userId` field so the PWA can show Edit/Delete buttons only for user-owned routines.

**Authorization:** POST/PATCH/DELETE on routines must verify `routine.userId === req.user.userId` (users can only modify their own routines).

### 3. New API Endpoint: Exercise Search

The spec requires searching exercises by name with body area and muscle groups. No standalone exercises endpoint exists currently. Need to add:
- `GET /exercises?search=<term>` — returns exercises where the term is a partial match for the exercise label

### 4. PWA Changes

**New route:** `/routines/:routineId/edit` -> `EditRoutinePage` component

**RoutinesPage modifications:**
- Add "Show recommended routines" checkbox (persisted via preferences API)
- Add "Create routine" button (calls `POST /routines`, then navigates to `/routines/:id/edit`)
- Add Edit/Delete buttons next to user-owned routines
- Delete uses existing `ConfirmDialog` component (already reusable)

**New EditRoutinePage:**
- Routine name input (auto-save on blur via `PATCH /routines/:id/label`)
- Exercise search input with live filtering against `GET /exercises?search=`
- Display matching exercises as `.highlightCard` items with body area/muscle groups
- Added exercises save immediately via `POST /routines/:id/exercises`
- Remove button per exercise via `DELETE /routines/:id/exercises/:exerciseId`
- "Finish" button navigates back to `/routines`

### 5. Type Changes

In `api/src/types.ts`:
- `RoutineSummary` needs `userId: number | null`
- Exercise search endpoint can return the existing `Exercise[]` type (already includes muscle groups)
- `UserPreferences` type

### 6. Key Risks / Decisions

1. **Position management** — when adding/removing exercises from a routine, positions need recalculating. The `@@unique([routineId, position])` constraint means careful ordering.
2. **Empty routine creation** — spec says create an empty routine immediately on button click. The `label` column currently has no default and is not nullable — need to allow empty/default label for newly created routines.

### Coding guidelines
Use existing CSS classes whereever possible, eg `.highlightCard`. If creating new classes, make them global rather than scoped to the page in a module.
