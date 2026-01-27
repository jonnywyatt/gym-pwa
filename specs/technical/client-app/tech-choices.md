# Technology choices for frontend PWA app

- Vite (build tool) + vite-plugin-pwa for PWA generation
- HTML
- CSS modules
- Typescript
- Vue 3 (Composition API with `<script setup>`)
- vue-router (client-side routing)
- oauth4webapi (OAuth 2.0 PKCE flow for Google login)
- Dexie.js (IndexedDB wrapper for offline storage)
- workbox-window (Service Worker communication)
- testing - vitest and Vue testing library

## Why Vue 3 + Vite (Not Nuxt)

This app is fundamentally a **Single Page Application (SPA)** with these characteristics:
- **Offline-first** - Core functionality works without network during workouts
- **Heavy client-side state** - Active workout, timers, sets, records (all in IndexedDB)
- **Minimal server interaction** - Only at login, workout start (sync records), workout finish (save)
- **PWA nature** - Needs to work as a standalone app

**Nuxt would add:**
- SSR/SSG - Not useful for offline-first PWA
- Server routes - Not needed (Express API already exists)
- Hydration complexity - Extra overhead for client-heavy app
- Server dependency - Contradicts offline-first philosophy

**Vue 3 + Vite gives:**
- Simpler mental model - Pure SPA
- Better offline-first support
- Lighter bundle - No Nuxt overhead
- Easier PWA setup
- Perfect for client-side state management
