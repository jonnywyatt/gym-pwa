# Client App Technical Specification

- [Technology choices](./tech-choices.md)
- [Offline data](./offline.md)

### Core
```bash
npm create vite@latest gym-pwa -- --template vue-ts
cd gym-pwa
```

### Required Dependencies
```bash
npm install vue-router           # Client-side routing
npm install dexie                # IndexedDB wrapper
npm install workbox-window       # Service Worker communication
```

### Dev Dependencies
```bash
npm install -D vite-plugin-pwa   # PWA generation
npm install -D @vitejs/plugin-vue
```

## PWA Configuration

See [vite.config.ts](code/vite.config.ts) for the complete Vite configuration including:
- PWA plugin setup with `vite-plugin-pwa`
- Service Worker runtime caching strategies:
  - App shell (HTML, CSS, JS): Cache-first with background update
  - API calls: Network-first with 24h cache fallback
  - Images: Cache-first with 30-day expiration, lazy load
- PWA manifest (app name, icons, theme colors)
- Environment variable definitions

## Environment Variables

Create environment files in your project root:
- [.env.development](code/.env.development) - Local development configuration
- [.env.production](code/.env.production) - Production configuration (update with your actual Railway URL)

## Project Structure

See **[../folder-structure.md](../folder-structure.md)** for the complete project folder structure.

The frontend lives in the `src/` directory with the following key folders:
- **lib/auth/** - OAuth service and authentication
- **lib/api/** - API client with auth headers
- **lib/db/** - Dexie IndexedDB setup
- **lib/stores/** - Vue composables (workout, user state)
- **routes/** - Page components
- **components/** - Reusable UI components

## Testing

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Test PWA in production mode
npm run build && npm run preview
```

Test offline:
1. Open DevTools → Application → Service Workers
2. Check "Offline" checkbox
3. Verify app still works during workout
