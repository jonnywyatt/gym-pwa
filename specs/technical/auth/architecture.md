# Auth Architecture

## Overview
Google OAuth 2.0 with PKCE, where the PWA initiates the flow and the API completes the token exchange.

## Why This Pattern?

**Client secret security** - The Google token exchange requires `GOOGLE_CLIENT_SECRET`. This cannot live in frontend code (visible in browser dev tools), so only the API can perform this exchange.

**Our own JWTs** - After verifying the Google token, we issue our own JWTs because:
- Custom expiry (7 days access, 30 days refresh)
- Custom payload with our database `userId`
- Stateless auth for API requests

## The Flow

```
1. PWA → Google
   User clicks "Sign in with Google"
   PWA generates PKCE challenge, redirects to Google

2. Google → PWA
   User authenticates with Google
   Google redirects to /auth/callback with authorization code

3. PWA → API
   PWA sends code + PKCE verifier to POST /auth/google

4. API → Google
   API exchanges code for Google tokens (using client secret)
   API verifies Google ID token

5. API → Database
   Upserts user record (links Google ID to our user)

6. API → PWA
   Returns our JWT access + refresh tokens

7. PWA → API (subsequent requests)
   PWA stores JWT in localStorage
   Sends as Bearer token on protected routes (/exercises)
```

## Token Storage
- `access_token` - localStorage, sent as `Authorization: Bearer <token>`
- `refresh_token` - localStorage, for future token refresh
- `pkce_code_verifier` - sessionStorage, cleared after callback
