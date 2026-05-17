import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, Route, registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope & {
  skipWaiting(): void;
  clients: { matchAll(): Promise<{ postMessage(msg: unknown): void }[]> };
  addEventListener(
    type: 'message',
    listener: (event: { data: unknown; waitUntil(p: Promise<unknown>): void }) => void
  ): void;
};

self.skipWaiting();
clientsClaim();

// Injected by vite-plugin-pwa at build time
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// SPA navigation
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

// ---------------------------------------------------------------------------
// Stale-while-revalidate API cache helpers
// ---------------------------------------------------------------------------
// All API routes use manual cache.put() to bypass the browser's restriction
// on caching responses to credentialed (Authorization header) requests.

function isFresh(cachedResponse: Response, ttlMs: number): boolean {
  const cachedAt = cachedResponse.headers.get('x-cached-at');
  if (!cachedAt) return false;
  return Date.now() - new Date(cachedAt).getTime() < ttlMs;
}

interface ApiCacheRouteOptions {
  cacheName: string;
  ttlMs: number;
  urlPattern: RegExp;
  cacheKey: (requestUrl: string) => string;
  notifyOnUpdate?: boolean;
}

function registerApiCacheRoute({
  cacheName,
  ttlMs,
  urlPattern,
  cacheKey: buildCacheKey,
  notifyOnUpdate = false,
}: ApiCacheRouteOptions): void {
  const route = new Route(
    ({ url }) => urlPattern.test(url.href),
    async ({ request }) => {
      const cache = await caches.open(cacheName);
      const cacheKey = buildCacheKey(request.url);
      const cachedResponse = await cache.match(cacheKey, { ignoreVary: true });

      const fetchAndCache = fetch(new Request(request, { cache: 'no-cache' })).then(
        async (networkResponse) => {
          if (networkResponse.ok) {
            const headers = new Headers(networkResponse.headers);
            headers.set('x-cached-at', new Date().toISOString());
            const responseToCache = new Response(await networkResponse.clone().arrayBuffer(), {
              status: networkResponse.status,
              statusText: networkResponse.statusText,
              headers,
            });
            await cache.put(cacheKey, responseToCache);

            if (notifyOnUpdate && cachedResponse) {
              const clients = await self.clients.matchAll();
              for (const client of clients) {
                client.postMessage({ type: 'DASHBOARD_UPDATED' });
              }
            }
          }
          return networkResponse;
        }
      );

      if (cachedResponse && isFresh(cachedResponse, ttlMs)) {
        fetchAndCache.catch(() => {});
        return cachedResponse;
      }

      return fetchAndCache;
    },
    'GET'
  );
  registerRoute(route);
}

// ---------------------------------------------------------------------------
// API cache routes
// ---------------------------------------------------------------------------

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

registerApiCacheRoute({
  cacheName: 'dashboard-api',
  ttlMs: 2 * ONE_DAY,
  urlPattern: /\/dashboard(\?.*)?$/,
  cacheKey: () => '/dashboard',
  notifyOnUpdate: true,
});

registerApiCacheRoute({
  cacheName: 'session-trends-api',
  ttlMs: 7 * ONE_DAY,
  urlPattern: /\/session-trends(\?.*)?$/,
  cacheKey: (url) => new URL(url).pathname,
});

registerApiCacheRoute({
  cacheName: 'workouts-api',
  ttlMs: ONE_HOUR,
  urlPattern: /\/users\/\d+\/workouts(\?.*)?$/,
  cacheKey: (url) => new URL(url).pathname,
});

registerApiCacheRoute({
  cacheName: 'routines-api',
  ttlMs: ONE_DAY,
  urlPattern: /\/routines(\?.*)?$/,
  cacheKey: () => '/routines',
});

registerApiCacheRoute({
  cacheName: 'routine-detail-api',
  ttlMs: ONE_DAY,
  urlPattern: /\/routines\/\d+$/,
  cacheKey: (url) => new URL(url).pathname,
});

registerApiCacheRoute({
  cacheName: 'preferences-api',
  ttlMs: ONE_DAY,
  urlPattern: /\/users\/\d+\/preferences$/,
  cacheKey: (url) => new URL(url).pathname,
});

// ---------------------------------------------------------------------------
// Cache invalidation via postMessage from the client
// ---------------------------------------------------------------------------

self.addEventListener('message', (event) => {
  const data = event.data as { type?: string; cacheNames?: string[] } | undefined;
  if (data?.type !== 'INVALIDATE_CACHE' || !Array.isArray(data.cacheNames)) return;
  event.waitUntil(Promise.all(data.cacheNames.map((name: string) => caches.delete(name))));
});

// ---------------------------------------------------------------------------
// Google Fonts
// ---------------------------------------------------------------------------

registerRoute(
  /^https:\/\/fonts\.googleapis\.com\//,
  new StaleWhileRevalidate({ cacheName: 'google-fonts-stylesheets' }),
  'GET'
);

registerRoute(
  /^https:\/\/fonts\.gstatic\.com\//,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  }),
  'GET'
);
