# Gym PWA API

Minimal Express API with Prisma and PostgreSQL for Goal 1.

## Local Development

### Prerequisites
- Node.js 24+
- Docker (for local PostgreSQL database)

### Setup

1. **Start local PostgreSQL database:**
   ```bash
   docker run --name gym-postgres \
     -e POSTGRES_PASSWORD=localdev \
     -e POSTGRES_DB=gym_dev \
     -p 5432:5432 \
     -d postgres:16
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment files:**
   - `.env` - Active configuration (points to local DB)
   - `.env.local` - Local development config (same as .env)
   - `.env.production` - Railway production credentials (for reference)
   - `.env.example` - Template

4. **Set up database:**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   API runs on http://localhost:3000

### Managing Docker PostgreSQL

```bash
# Start existing container
docker start gym-postgres

# Stop container
docker stop gym-postgres

# View logs
docker logs gym-postgres

# Remove container (deletes all data!)
docker rm -f gym-postgres
```

## Endpoints

- `GET /health` - Health check
- `GET /exercises` - Get all exercises

## Deployment to Railway

### Initial Setup

1. **Connect to GitHub:**
   - Go to Railway dashboard
   - Click "+ New" → "GitHub Repo"
   - Select this repository
   - Set root directory to `api`

2. **Environment Variables:**
   - `DATABASE_URL` - Auto-filled by Railway when you add PostgreSQL
   - `PORT` - Auto-set by Railway
   - `NODE_ENV` - Set to `production`
   - `CORS_ORIGIN` - Your frontend URL (add later)

3. **Deploy Settings:**
   Railway will automatically use `railway.json` which:
   - Builds with Nixpacks
   - Runs `prisma:push` to sync schema
   - Runs `seed` to populate initial data
   - Starts the server

### Auto-Deployment

Once connected, Railway automatically deploys when you push to the `main` branch.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema to database
- `npm run seed` - Seed database with initial data
