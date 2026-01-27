# Railway Deployment Configuration

## 🚨 Quick Setup Checklist

Before deploying, configure these in Railway dashboard:

### Step 1: Set Root Directory
1. Click on your service
2. Go to **Settings** tab
3. Scroll down to **Build** section
4. Set **Root Directory**: `api`
5. Click **Deploy** (or changes auto-deploy)

### Step 2: Node Version (Auto-Detected ✅)
Railway will automatically detect Node 24 from the `.node-version` file at the repo root.

**No manual configuration needed!**

_(Optional: If auto-detection doesn't work, you can manually set `NIXPACKS_NODE_VERSION=24` in the Variables tab)_

### Step 3: Configure Environment Variables
Go to the **Variables** tab and ensure you have:
- `DATABASE_URL` - Auto-provided by Railway Postgres addon (should already exist)
- `CORS_ORIGIN` - Your frontend URL (e.g., `https://gym-pwa-321.netlify.app`)
- `NODE_ENV` - Set to `production`

---

## Why These Settings Are Required

### Root Directory
This is a **monorepo** with the API in the `api/` subdirectory. Setting the root directory tells Railway where to find `package.json` and build the project.

### Node Version
**Node 24+ is required for Prisma 7.** The `engines` field in `package.json` specifies `"node": ">=24.0.0"`. Building with Node 18 will fail with "Unsupported engine" error.

Railway automatically detects the `.node-version` file at the repository root (which contains `24`), so Node 24 will be used without any manual configuration.

## Configuration Files

- **`railway.json`** - Main Railway configuration (takes precedence)
- **`railway.toml`** - Legacy configuration (kept for reference)
- **`.node-version`** - At repo root and in `api/` - both specify Node 24 (auto-detected by Nixpacks)

## Environment Variables (Set in Railway Dashboard)

Required environment variables to configure in Railway:

- `DATABASE_URL` - PostgreSQL connection string (provided by Railway Postgres)
- `CORS_ORIGIN` - Frontend URL (e.g., `https://gym-pwa-321.netlify.app`)
- `NODE_ENV` - Set to `production`

## Build Process

1. Install dependencies: `npm install`
2. Generate Prisma client: `npm run prisma:generate`
3. Build TypeScript: `npm run build`

## Deploy Process

1. Push Prisma schema to database: `npx prisma db push --url="$DATABASE_URL"`
2. Seed database: `npm run seed`
3. Start server: `npm start`

## Prisma 7 Compatibility

The deployment commands use `--url` flag to pass the database URL explicitly, as required by Prisma 7.
