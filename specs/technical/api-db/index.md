# Remote Database Technical Specification

## Overview

This document covers the **server-side database** setup using:
- **Prisma** - Type-safe ORM for defining schema and querying data
- **Railway PostgreSQL** - Fully-managed PostgreSQL database
- **Express API** - RESTful API server

**Important:** This is separate from the **client-side IndexedDB** (covered in [offline-technical.md](./offline-technical.md)). See architecture diagram below.

See also: 
[Technology choices](./tech-choices.md)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Browser (Client-side)                                   │
│                                                         │
│  Vue App ──→ Dexie.js ──→ IndexedDB                    │
│                                                         │
│  Purpose: Offline workout data during active session    │
│  Schema: Defined in TypeScript with Dexie             │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTP (when online)
                         │ Sync at workout start/finish
                         │
┌────────────────────────▼────────────────────────────────┐
│ Railway (Server-side)                                   │
│                                                         │
│  Express API ──→ Prisma Client ──→ PostgreSQL          │
│                                                         │
│  Purpose: Persistent storage of all user data          │
│  Schema: Defined in Prisma Schema Language             │
└─────────────────────────────────────────────────────────┘
```

## Why You Need Both

### Server-side (Prisma + Railway PostgreSQL)
- ✅ Permanent storage of all workouts, routines, records
- ✅ Multi-device sync
- ✅ Data backup and recovery (automatic with Railway)
- ✅ Cross-user features (leaderboards, sharing - future)
- ✅ Rich queries and analytics

### Client-side (Dexie + IndexedDB)
- ✅ Offline capability during workouts
- ✅ Instant feedback (no network latency)
- ✅ Temporary storage during active workout
- ✅ Queue failed syncs

**They work together:** Client syncs to/from server at workout start/finish.
