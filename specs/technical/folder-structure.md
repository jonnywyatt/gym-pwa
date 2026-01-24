# Project Folder Structure

This document defines the complete folder structure for the gym PWA project.

## Full Project Structure

```
gym-pwa/
├── .github/
│   └── workflows/
│       └── ci.yml                     # CI pipeline (see deploy/index.md)
│
├── src/                               # Svelte PWA (Frontend)
│   ├── lib/
│   │   ├── auth/
│   │   │   └── oauth.ts              # OAuth service (see client-app/client-auth.md)
│   │   ├── api/
│   │   │   └── client.ts             # API client with auth headers
│   │   ├── db/
│   │   │   └── index.ts              # Dexie IndexedDB setup (see client-app/offline.md)
│   │   └── stores/
│   │       ├── workout.ts            # Workout state
│   │       └── user.ts               # User state
│   ├── routes/
│   │   ├── Home.svelte
│   │   ├── Login.svelte              # See client-app/client-auth.md
│   │   ├── AuthCallback.svelte       # See client-app/client-auth.md
│   │   ├── Routines.svelte
│   │   ├── Workout.svelte
│   │   └── WorkoutHistory.svelte
│   ├── components/
│   │   ├── Timer.svelte
│   │   ├── SetLogger.svelte
│   │   └── ExerciseCard.svelte
│   ├── App.svelte
│   ├── routes.ts                     # Route config with auth guards
│   └── main.ts
│
├── api/                               # Express API (Backend)
│   ├── src/
│   │   ├── index.ts                  # Express server (see api-db/index.md)
│   │   ├── routes/
│   │   │   ├── auth.ts              # OAuth route (see api-db/code/auth-route.ts)
│   │   │   ├── workouts.ts          # Workouts CRUD (see api-db/code/routes-workouts.ts)
│   │   │   ├── routines.ts          # Routines CRUD
│   │   │   └── records.ts           # Personal records
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT verification (see api-db/code/middleware-auth.ts)
│   │   │   └── errorHandler.ts
│   │   └── utils/
│   │       └── prisma.ts            # Prisma singleton (see api-db/code/prisma-client.ts)
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema (see api-db/code/schema.prisma)
│   │   ├── seed.ts                  # Seed data script
│   │   └── migrations/              # Database migrations
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example                 # Environment variables template (see api-db/code/.env.example)
│
├── public/
│   ├── icon-192.png
│   └── icon-512.png
│
├── netlify.toml                      # Netlify config (see deploy/code/netlify/netlify.toml)
├── package.json                      # Root/frontend package.json
├── vite.config.ts                    # Vite + PWA config (see client-app/code/vite.config.ts)
├── tsconfig.json
├── .env.development                  # Frontend dev env (see client-app/code/.env.development)
├── .env.production                   # Frontend prod env (see client-app/code/.env.production)
└── README.md
```

## Architecture Overview

This is a **monorepo** structure with:
- **Frontend** in `src/` - Svelte PWA deployed to Netlify
- **Backend** in `api/` - Express + Prisma API deployed to Railway
- **CI/CD** in `.github/workflows/` - GitHub Actions for testing

## Key Directories

### Frontend (`src/`)
- **lib/auth/** - OAuth 2.0 PKCE authentication
- **lib/api/** - HTTP client with automatic auth headers
- **lib/db/** - IndexedDB for offline workout storage
- **lib/stores/** - Svelte stores for reactive state
- **routes/** - Page components (using svelte-spa-router)
- **components/** - Reusable UI components

### Backend (`api/`)
- **src/routes/** - RESTful API endpoints
- **src/middleware/** - JWT auth, error handling
- **src/utils/** - Prisma client, shared utilities
- **prisma/** - Database schema and migrations

### Deployment
- **.github/workflows/** - CI pipeline (tests, linting, type-checking)
- **netlify.toml** - Frontend deployment config
- **api/railway.json** - Backend deployment config (optional)

## Documentation References

- Frontend setup: [client-app/index.md](client-app/index.md)
- Authentication: [client-app/client-auth.md](client-app/client-auth.md)
- Offline data: [client-app/offline.md](client-app/offline.md)
- Backend API: [api-db/index.md](api-db/index.md)
- Deployment: [deploy/index.md](deploy/index.md)
