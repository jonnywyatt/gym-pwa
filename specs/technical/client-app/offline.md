
# Offline first 

Context - "Offline-first strategy during workouts" in [spec.md](../../spec.md).

Workout Start
1. User selects routine
2. Fetch personal records from API → Store in IndexedDB
3. Create workout snapshot in IndexedDB (routine + empty sets)
4. Start workout timer
5. User is now offline-capable

During Workout (Fully Offline)
1. User completes set → Save to IndexedDB instantly
2. Compare against local records (from step 2 above)
3. If new record → Show celebration + update local records
4. All comparisons use IndexedDB only (instant feedback)

Workout Finish
1. User clicks "Finish Workout"
2. Calculate totals (weight moved, duration, body areas %)
3. Push workout data to API
4. On success: Clear workout from IndexedDB
5. On failure: Keep in IndexedDB and retry the sync periodically until it succeeds

## Implementation Details

### IndexedDB Schema

See [db-schema.ts](code/db-schema.ts) for the complete Dexie.js schema with:
- `workouts` - Active and pending-sync workouts
- `personalRecords` - Cached records for offline comparison
- `routines` - Pre-seeded + user-created routines
- `exercises` - Pre-seeded exercise library
### Workout Service

See [workout-service.ts](code/workout-service.ts) for the complete implementation with:
- `startWorkout()` - Fetches records from API, creates local workout snapshot
- `completeSet()` - Saves sets to IndexedDB, checks for new records instantly
- `finishWorkout()` - Calculates totals, syncs to server, handles failures

### Handling Failed Sync

See [sync-helpers.ts](code/sync-helpers.ts) for sync retry logic:
- `checkForPendingWorkouts()` - On app load, check for unsaved workouts
- `retrySyncWorkout()` - Manual retry for failed syncs
- `completeSetOptimistic()` - Optimistic UI pattern for instant feedback

Edge Cases to Handle

1. App Closed Mid-Workout

On app reopen:
- Check for workout with status='in-progress'
- Show: "Resume workout from [time ago]?" or "Discard?"
- If resume: continue with same workout ID

2. Network Failure on Finish

- Show error: "Could not save workout. It's stored locally."
- Add "Unsaved Workouts" section to home screen
- Provide manual "Retry Sync" button

3. Multiple Devices

Since you sync at start/finish only:
- Records might be stale if user used another device recently
- Solution: Show last sync time: "Records as of 2 hours ago"
- Or: Add manual "Refresh Records" button before starting workout

4. Personal Records During Workout

When user sets a new record:
1. Update local IndexedDB immediately (for subsequent sets in same workout)
2. Include new records in workout payload when syncing
3. Server updates global records during workout save

UI Indicators

Before Workout:
🟢 "Records up to date" (if recently synced)
🟡 "Records from 2 days ago - Tap to refresh"

During Workout:
💾 "Saving..." (after each set, instant)
✅ "Saved" (confirmation)
🎉 "New Record!" (instant comparison)

After Finish:
⬆️ "Syncing workout..." (saving to server)
✅ "Workout saved!"
❌ "Sync failed - Workout saved locally" (with retry button)

Testing Scenarios

1. Happy path: Start → Complete sets → Finish (online throughout)
2. Fully offline: Start online → Go offline → Complete workout → Finish fails → Go online → Retry sync
3. App crash mid-workout: Close app → Reopen → Resume or discard
4. Network flaky on finish: Finish button → Network timeout → Retry logic

## Summary

This offline-first strategy provides:
- Instant feedback during workouts (no network calls)
- Automatic record detection with local comparison
- Graceful handling of sync failures
- Simple sync boundaries at workout start/finish

The workout boundaries make perfect sync points, and keeping everything local during the workout ensures instant feedback for records. The only complexity is handling failed syncs at finish, but that's much simpler than continuous background sync.
