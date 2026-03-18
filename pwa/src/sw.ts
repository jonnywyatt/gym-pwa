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
};

self.skipWaiting();
clientsClaim();

// Injected by vite-plugin-pwa at build time
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// SPA navigation
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

// Dashboard API: stale-while-revalidate with manual cache.put() to bypass
// the browser's restriction on caching responses to credentialed requests.
const DASHBOARD_CACHE = 'dashboard-api';
const DASHBOARD_TTL_MS = 48 * 60 * 60 * 1000;

function isCachedResponseFresh(cachedResponse: Response): boolean {
  const cachedAt = cachedResponse.headers.get('x-cached-at');
  if (!cachedAt) return false;
  return Date.now() - new Date(cachedAt).getTime() < DASHBOARD_TTL_MS;
}

const dashboardRoute = new Route(
  ({ url }) => /\/dashboard(\?.*)?$/.test(url.href),
  async ({ request }) => {
    const cache = await caches.open(DASHBOARD_CACHE);
    const cachedResponse = await cache.match(request, { ignoreVary: true });

    const fetchAndCache = fetch(request).then(async (networkResponse) => {
      if (networkResponse.ok) {
        const headers = new Headers(networkResponse.headers);
        headers.set('x-cached-at', new Date().toISOString());
        const responseToCache = new Response(await networkResponse.clone().arrayBuffer(), {
          status: networkResponse.status,
          statusText: networkResponse.statusText,
          headers,
        });
        await cache.put(request, responseToCache);

        if (cachedResponse) {
          const clients = await self.clients.matchAll();
          for (const client of clients) {
            client.postMessage({ type: 'DASHBOARD_UPDATED' });
          }
        }
      }
      return networkResponse;
    });

    if (cachedResponse && isCachedResponseFresh(cachedResponse)) {
      fetchAndCache.catch(() => {});
      return cachedResponse;
    }

    return fetchAndCache;
  },
  'GET'
);
registerRoute(dashboardRoute);

// Google Fonts stylesheets
registerRoute(
  /^https:\/\/fonts\.googleapis\.com\//,
  new StaleWhileRevalidate({ cacheName: 'google-fonts-stylesheets' }),
  'GET'
);

// Google Fonts files
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
