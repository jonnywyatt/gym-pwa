# Railway Deployment Configuration

## 🚨 Quick Setup Checklist

Before deploying, configure these in Railway dashboard:

### Step 1: Set Root Directory
1. Click on your service
2. Go to **Settings** tab
3. Scroll down to **Build** section
4. Set **Root Directory**: `api`
5. Click **Deploy** (or changes auto-deploy)

### Step 2: Node Version (Dockerfile ✅)
The API now uses a **Dockerfile** for building, which explicitly specifies Node 24.

**No manual configuration needed!** Node 24 is hardcoded in the Dockerfile.

### Step 3: Configure Environment Variables
Go to the **Variables** tab and ensure you have:
- `DATABASE_URL` - Auto-provided by Railway Postgres addon (should already exist)
- `CORS_ORIGIN` - Your frontend URL (e.g., `https://gym-pwa-321.netlify.app`)
- `NODE_ENV` - Set to `production`

---

## Why These Settings Are Required

### Root Directory
This is a **monorepo** with the API in the `api/` subdirectory. Setting the root directory tells Railway where to find the `Dockerfile` and build the project.

### Node Version
**Node 24+ is required for Prisma 7.** The `engines` field in `package.json` specifies `"node": ">=24.0.0"`.

The **Dockerfile** explicitly uses `FROM node:24-alpine`, guaranteeing Node 24 is used for the build.

## Build Method: Dockerfile

The API now uses a **Dockerfile** for deployment instead of Nixpacks. This provides:
- ✅ Explicit Node 24 version control
- ✅ Reproducible builds
- ✅ No auto-detection issues
- ✅ Full control over build process

## Configuration Files

- **`Dockerfile`** - Defines the build image (Node 24 Alpine)
- **`.dockerignore`** - Excludes unnecessary files from Docker build
- **`railway.json`** - Railway configuration (uses Dockerfile builder)
- **`railway.toml`** - Legacy configuration (kept for reference)

## Environment Variables (Set in Railway Dashboard)

Required environment variables to configure in Railway:

- `DATABASE_URL` - PostgreSQL connection string (provided by Railway Postgres)
- `CORS_ORIGIN` - Frontend URL (e.g., `https://gym-pwa-321.netlify.app`)
- `NODE_ENV` - Set to `production`

## Build Process (Dockerfile)

1. Use Node 24 Alpine base image
2. Copy package files and install dependencies: `npm ci`
3. Generate Prisma client: `npm run prisma:generate`
4. Build TypeScript: `npm run build`
5. Expose port 3000

## Deploy Process

1. Push Prisma schema to database: `npx prisma db push --url="$DATABASE_URL"`
2. Seed database: `npm run seed`
3. Start server: `npm start`

## Prisma 7 Compatibility

The deployment commands use `--url` flag to pass the database URL explicitly, as required by Prisma 7.
