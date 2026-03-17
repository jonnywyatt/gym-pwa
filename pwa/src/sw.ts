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

declare const self: ServiceWorkerGlobalScope & { skipWaiting(): void };

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
const dashboardRoute = new Route(
  ({ url }) => /\/dashboard(\?.*)?$/.test(url.href),
  async ({ request }) => {
    const cache = await caches.open(DASHBOARD_CACHE);
    const cachedResponse = await cache.match(request, { ignoreVary: true });

    const fetchAndCache = fetch(request).then(async (networkResponse) => {
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    });

    return cachedResponse ?? fetchAndCache;
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
