# Deployment Technical Specification

## Overview

This project uses a simple, automated deployment strategy:
- **Frontend (PWA)**: Netlify (auto-deploy from GitHub)
- **Backend (API + Database)**: Railway (auto-deploy from GitHub)
- **CI/CD**: GitHub Actions (testing on every PR/push)

## Architecture

```
GitHub Repository
    │
    ├─→ GitHub Actions (CI - runs tests)
    │
    ├─→ Netlify (Frontend PWA - auto-deploy on push to main)
    │
    └─→ Railway (Express API + PostgreSQL - auto-deploy on push to main)
```

**Benefits of this setup:**
- Single platform for backend (Railway)
- Standard Express debugging (breakpoints work!)
- Auto-deploy on git push
- Integrated PostgreSQL with automatic backups
- No serverless constraints (no timeouts, long-running operations OK)

## 1. GitHub Actions CI Setup

### CI Pipeline Configuration

See [ci.yml](./code/github-actions/ci.yml) for the complete GitHub Actions CI workflow with:
- Separate jobs for frontend and API testing
- PostgreSQL service for API tests
- Linting, type-checking, and testing
- Build verification

Configuration file location: `.github/workflows/ci.yml`

## 2. Netlify Setup (Frontend PWA)

### Initial Setup

1. **Sign up at netlify.com** with your GitHub account
2. **Click "Add new site" → "Import an existing project"**
3. **Connect to GitHub** and select your repository
4. **Configure build settings:**
   - Base directory: (pwa)
   - Build command: `npm run build`
   - Publish directory: `dist`

### Netlify Configuration File

See [netlify.toml](./code/netlify/netlify.toml) for the complete configuration with:
- Build settings and Node version
- SPA routing redirects
- Security headers (CSP, X-Frame-Options, etc.)
- Cache control for assets and service worker
- Multi-environment configuration (production, preview, branch deploys)

Configuration file location: `netlify.toml` in project root

### Environment Variables in Netlify

See [.env.example](code/netlify/.env.example) for required variables.

Go to **Site settings → Environment variables** and add the variables from .env.example with your actual values.

### Deploy Contexts (Optional)

You can add deploy context configurations to `netlify.toml` for different environments (production, deploy-preview, branch-deploy) to use different API URLs per environment.

## 3. Railway Setup (API + Database)

### Initial Setup

1. **Sign up at railway.app** with your GitHub account
2. **Create a new project**
3. **Add PostgreSQL service:**
   - Click "+ New"
   - Select "Database → PostgreSQL"
   - Railway auto-creates `DATABASE_URL` environment variable

4. **Add API service:**
   - Click "+ New"
   - Select "GitHub Repo"
   - Choose your repository
   - Configure:
     - Root Directory: `api`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm run prisma:migrate && npm start`

### Railway Configuration

See [railway.json](code/railway/railway.json) for the complete Railway configuration with:
- Nixpacks builder configuration
- Start command with automatic migrations
- Restart policy for failure handling

Configuration file location: `api/railway.json` (optional)

### Environment Variables in Railway

See **[../api-db/index.md](../api-db/index.md#environment-variables)** for the complete list of required API environment variables.

In your **API service settings → Variables**, add all the variables from the api-db .env.example file with your actual values.

### Connect PostgreSQL to API Service

1. In Railway, click your API service
2. Go to "Variables" tab
3. Click "Reference" → Select PostgreSQL service → DATABASE_URL
4. Railway automatically injects the connection string

### Expose API to Internet

1. Click on your API service
2. Go to "Settings" tab
3. Under "Networking" → Click "Generate Domain"
4. Railway provides a URL like: `your-service.up.railway.app`
5. Use this URL in Netlify environment variables

## 4. Environment Variables Summary

### GitHub Secrets (for CI)

Go to **GitHub repo → Settings → Secrets and variables → Actions**:

```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Frontend Environment Files

See [.env.example](code/netlify/.env.example) for the frontend environment variables template.

**`.env.example`** (commit this) - Contains all required frontend variables with placeholder values
**`.env.local`** (DO NOT commit - add to .gitignore) - Copy from .env.example and fill with your actual values

### API Environment Files

See **[../api-db/index.md](../api-db/index.md#environment-variables)** for the API environment variables documentation and template.

**`api/.env.example`** (commit this) - Template with all required variables
**`api/.env`** (DO NOT commit - add to .gitignore) - Copy from template with actual values

## 6. Deployment Workflow

### Development
```bash
# Terminal 1: API
cd api
npm run dev

# Terminal 2: Frontend
npm run dev
```

### Debugging in VSCode

See [launch.json](code/github-actions/launch.json) for the complete VSCode debug configuration with:
- API debugging with tsx watch
- Frontend debugging with Chrome
- Full-stack compound configuration

Configuration file location: `.vscode/launch.json`

### Commit and Push
```bash
git add .
git commit -m "Your changes"
git push origin main
```

**What happens:**
1. GitHub Actions runs CI tests
2. If tests pass on `main` branch:
   - Netlify automatically deploys frontend
   - Railway automatically deploys API
3. Your app is live in ~2-5 minutes

### Monitoring Deployments

**Netlify:**
- Dashboard: netlify.com/sites/your-site/deploys
- View build logs
- Instant preview URLs for PRs

**Railway:**
- Dashboard: railway.app/project/your-project
- View deployment logs
- Monitor API health and metrics
- View database metrics

## 8. Custom Domains (Optional)

### Netlify (Frontend)
1. Go to Site settings → Domain management
2. Add custom domain: `app.yoursite.com`
3. Configure DNS:
   ```
   CNAME app your-site.netlify.app
   ```
4. Netlify auto-provisions SSL certificate

### Railway (API)
1. Go to your API service → Settings → Networking
2. Click "Custom Domain"
3. Add your domain: `api.yoursite.com`
4. Configure DNS:
   ```
   CNAME api your-service.up.railway.app
   ```
5. Railway auto-provisions SSL certificate

### Update Environment Variables
```bash
# Netlify
VITE_API_URL=https://api.yoursite.com

# Railway
CORS_ORIGIN=https://app.yoursite.com
```

## 9. Monitoring and Debugging

### Railway Logs
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs

# Follow logs in real-time
railway logs -f
```

### Production Debugging Checklist

**Frontend issues:**
- Check Netlify deploy logs
- Check browser console (Service Worker errors)
- Verify environment variables are set
- Test PWA in incognito mode

**API issues:**
- Check Railway deployment logs
- Check Railway metrics (CPU, memory)
- Verify DATABASE_URL is connected
- Test API endpoints with curl/Postman
- Check CORS_ORIGIN matches frontend URL

**Database issues:**
- Check Railway PostgreSQL service is running
- Verify migrations ran successfully
- Use Railway's PostgreSQL query interface to inspect data
- Check connection pool settings

### Railway CLI Commands

```bash
# View service status
railway status

# View logs
railway logs

# Open Railway dashboard
railway open

# Connect to PostgreSQL directly
railway connect postgres

# Run commands in Railway environment
railway run npm run prisma:studio
```

## 10. Database Migrations

### Development

```bash
cd api

# Create a new migration
npx prisma migrate dev --name add_new_field

# This will:
# 1. Create SQL migration file in prisma/migrations/
# 2. Apply migration to your local database
# 3. Regenerate Prisma Client
```

### Production

Migrations run automatically during Railway deployment (configured in start command):

```json
{
  "scripts": {
    "start": "npm run prisma:migrate && node dist/index.js"
  }
}
```

Or run manually via Railway CLI:

```bash
railway run npx prisma migrate deploy
```

## 11. Rollback Strategy

### Netlify Rollback
1. Go to Deploys tab
2. Find previous successful deploy
3. Click "Publish deploy"

### Railway Rollback
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "Redeploy"

### Database Rollback

Railway PostgreSQL includes daily automatic backups:
1. Go to PostgreSQL service → Backups
2. Select backup to restore
3. Click "Restore"

For migration rollback:
```bash
# Revert last migration
npx prisma migrate resolve --rolled-back <migration_name>
```

## 12. Cost Estimates

### Free Tier (Development/Testing)
- **Netlify**: 100GB bandwidth, 300 build minutes/month
- **Railway**: $5 monthly credit
- **GitHub Actions**: 2000 minutes/month (free for public repos)

**Total: ~$0-5/month**

### Production (with moderate traffic)
- **Netlify**: Free tier should suffice, or $19/month (Pro)
- **Railway**:
  - Starter: $5/month base
  - API service: ~$5/month usage
  - PostgreSQL: ~$5/month usage
  - Total: ~$10-15/month
- **GitHub Actions**: Free or $4/month for extra minutes

**Total: ~$10-35/month**

## 13. Security Checklist

- [ ] All secrets in environment variables (never in code)
- [ ] `.env` files in `.gitignore`
- [ ] CORS configured properly in API
- [ ] HTTPS enabled on all domains (automatic with Netlify/Railway)
- [ ] JWT secrets are strong (32+ characters)
- [ ] Database has SSL enabled (automatic with Railway)
- [ ] Google OAuth redirect URIs are exact matches
- [ ] Service Worker only served over HTTPS in production
- [ ] API validates all user input
- [ ] Rate limiting implemented (consider express-rate-limit)

## 14. Testing in Production

After deployment:

1. **Test PWA installation:**
   - Open app in Chrome
   - Look for install prompt
   - Install to home screen
   - Test offline functionality

2. **Test OAuth flow:**
   - Sign in with Google
   - Verify token is stored
   - Test authenticated API calls

3. **Test workout flow:**
   - Start a workout
   - Complete sets
   - Go offline (DevTools → Network → Offline)
   - Complete more sets
   - Go back online
   - Finish workout
   - Verify data synced to server

4. **Check Service Worker:**
   - DevTools → Application → Service Workers
   - Verify it's active
   - Test cache strategies

5. **Check API:**
   - Test all endpoints with Postman
   - Verify proper error handling
   - Check logs in Railway

## 15. Useful Commands

```bash
# Build locally (matches production)
npm run build && npm run preview
cd api && npm run build && npm start

# Database management
cd api
npx prisma migrate dev          # Create and apply migration
npx prisma migrate deploy       # Apply migrations (production)
npx prisma studio               # Open database GUI
npx prisma db push              # Sync schema without migration

# Railway CLI
railway login
railway logs                    # View logs
railway logs -f                 # Follow logs
railway connect postgres        # Connect to database
railway run <command>           # Run command in Railway env

# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 16. Troubleshooting

### "Service Worker registration failed"
- Check Netlify headers in `netlify.toml`
- Ensure HTTPS in production
- Clear browser cache

### "API CORS error"
- Verify `CORS_ORIGIN` in Railway matches Netlify URL
- Check API is running (Railway logs)
- Ensure no trailing slash in origin URL

### "Database connection failed"
- Verify `DATABASE_URL` is set in Railway
- Check PostgreSQL service is running
- Verify migrations ran (check Railway logs)
- Check connection pool settings

### "OAuth redirect URI mismatch"
- Exact match required in Google Console
- Include protocol (https://)
- No trailing slash
- Check both origins and redirect URIs

### "Build fails on Netlify"
- Check build logs for errors
- Verify Node version (should be 20)
- Check `netlify.toml` configuration
- Verify environment variables are set

### "API deployment fails on Railway"
- Check deployment logs
- Verify `package.json` scripts are correct
- Check TypeScript compilation errors
- Verify Prisma schema is valid

### "Prisma Client not generated"
- Run `npx prisma generate` locally
- Ensure Railway runs `prisma generate` in build
- Check for Prisma schema syntax errors

## 17. Performance Optimization

### API Performance

```typescript
// Optimize Prisma queries with indexes (already in schema)
// Use select to fetch only needed fields
const workouts = await prisma.workout.findMany({
  select: {
    id: true,
    completedAt: true,
    totalWeightKg: true
  },
  take: 50
});

// Use connection pooling (automatic with Railway PostgreSQL)
```

### Database Performance
- Indexes already configured in Prisma schema
- Use `LIMIT` (Prisma `take`) on large result sets
- Monitor slow queries in Railway dashboard
- Consider caching frequent queries with Redis (future)

### Frontend Performance
- Service Worker caches app shell
- Lazy load routes with vue-router
- IndexedDB for offline data
- Optimistic UI updates

## 18. Scaling Considerations

Railway scales automatically based on usage:

**When to scale up:**
- Consistent high CPU/memory usage
- Slow response times
- Connection pool exhaustion

**How to scale:**
1. Railway dashboard → Service → Resources
2. Increase CPU/RAM allocations
3. Or enable autoscaling (paid plans)

**Database scaling:**
- Railway PostgreSQL scales automatically
- Monitor storage usage
- Add read replicas if needed (paid plans)

## Summary

**Your stack:**
- ✅ Netlify (Frontend) + Railway (Backend + DB)
- ✅ Standard Express debugging (breakpoints work!)
- ✅ Auto-deploy from GitHub
- ✅ Integrated PostgreSQL with backups
- ✅ No serverless constraints
- ✅ ~$10-15/month for production

**Perfect for:**
- Solo developers
- Standard Node.js workflows
- Apps needing proper debugging
- Production-ready from day one

Your gym PWA is ready to deploy!
