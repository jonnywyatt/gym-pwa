export type InvalidatableCacheName =
  | 'dashboard-api'
  | 'session-trends-api'
  | 'workouts-api'
  | 'routines-api'
  | 'routine-detail-api'
  | 'preferences-api';

export function invalidateSwCache(...cacheNames: InvalidatableCacheName[]): void {
  if (!navigator.serviceWorker?.controller) return;
  navigator.serviceWorker.controller.postMessage({
    type: 'INVALIDATE_CACHE',
    cacheNames,
  });
}
