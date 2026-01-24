# Gym PWA API

Minimal Express API with Prisma and PostgreSQL for Goal 1.

## Local Development

### Prerequisites
- Node.js 24+
- Railway PostgreSQL database

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Railway DATABASE_URL
   ```

3. **Set up database:**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   API runs on http://localhost:3000

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
