# Client-Side Authentication

This document covers client-side authentication implementation for the gym PWA using OAuth 2.0 PKCE flow with Google.

See [client-app.md](index.md) for general client app setup and [remote-database.md](../api-db/index.md) for backend implementation.

**Quick overview:**
- OAuth 2.0 PKCE flow with Google
- Library: `oauth4webapi` (standards-compliant, TypeScript-first)
- Token storage: localStorage (for offline PWA requirements)
- Auth guards on protected routes
- Backend JWT verification

## Why OAuth 2.0 PKCE?

**PKCE (Proof Key for Code Exchange)** is the recommended OAuth flow for public clients like SPAs and mobile apps:

- ✅ Secure for public clients (no client secret needed)
- ✅ Protects against authorization code interception
- ✅ Industry standard for SPAs
- ✅ Required by OAuth 2.1 specification

## Library Choice

### Recommended: oauth4webapi

**Modern OAuth 2.0 client library**

```bash
npm install oauth4webapi
```

**Why oauth4webapi:**
- ✅ Standards-compliant OAuth 2.0 / OIDC
- ✅ Built-in PKCE support (secure for SPAs)
- ✅ TypeScript-first
- ✅ Provider-agnostic (easy to add more providers later)
- ✅ Actively maintained
- ✅ Small bundle size (~10kb)
- ✅ No dependencies

### Alternative: Google Identity Services

```bash
npm install @google/identity-services
```
- Simpler for Google-only
- Official Google library
- Good for MVP, less flexible long-term

**Recommendation:** Use **oauth4webapi** for better long-term flexibility and standards compliance.

## Implementation

### 1. OAuth Service

See [oauth.ts](code/oauth.ts) - Complete OAuth 2.0 PKCE implementation with:
- PKCE challenge generation and verification
- Google OAuth URL configuration
- `initiateLogin()` - Redirects to Google auth
- `handleCallback(code)` - Exchanges auth code for JWT tokens
- Token storage in localStorage
- `isAuthenticated()` check

### 2. API Client with Auth

See [api-client.ts](code/api-client.ts) - HTTP client with automatic auth header injection:
- Adds `Authorization: Bearer <token>` to all requests
- Auto-logout on 401 (expired token)
- Convenience methods: `get()`, `post()`, `delete()`

### 3. Login Page

See [Login.vue](code/Login.vue) - Simple login page with:
- "Sign in with Google" button
- Calls `authService.initiateLogin()` to start OAuth flow
- Styled with Google blue branding

### 4. Auth Callback Handler

See [AuthCallback.vue](code/AuthCallback.vue) - Handles OAuth redirect:
- Extracts authorization code from URL params
- Calls `authService.handleCallback()` to exchange for tokens
- Shows loading spinner during exchange
- Displays errors if auth fails
- Redirects to home page on success

### 5. Routing with Auth Guards

See [routes.ts](code/routes.ts) - Route configuration with auth protection using vue-router:
- `requireAuth()` navigation guard checks authentication
- Protected routes: `/`, `/routines`, `/workout/:id`, `/history`
- Public routes: `/login`, `/auth/callback`
- Navigation guard redirects to login when not authenticated

See [App.vue](code/App.vue) - Main app component:
- Sets up `vue-router` with `<router-view>`
- Integrates with route guards

## Backend Token Verification (Express)

The Express API verifies the authorization code and issues JWTs.

See **[../api-db/auth-route.ts](../api-db/code/auth-route.ts)** for the backend auth route implementation with:
- OAuth2Client to exchange auth code with Google
- ID token verification
- User lookup/creation in PostgreSQL
- JWT generation (access + refresh tokens)

## Environment Variables

See [.env.development](code/.env.development) and [.env.production](code/.env.production) for environment configuration.

Required variables:
- `VITE_API_URL` - Your Railway API URL
- `VITE_GOOGLE_CLIENT_ID` - OAuth client ID from Google Cloud Console

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable Google+ API
    - APIs & Services → Enable APIs and Services
    - Search for "Google+ API" → Enable
4. Create OAuth 2.0 Client ID:
    - APIs & Services → Credentials
    - Create Credentials → OAuth client ID
   - Application type: Web application
   - Authorized JavaScript origins:
     - `http://localhost:5173` (dev)
     - `https://your-app.netlify.app` (prod)
   - Authorized redirect URIs:
     - `http://localhost:5173/auth/callback` (dev)
     - `https://your-app.netlify.app/auth/callback` (prod)
5. Copy Client ID to your `.env` files
6. Copy Client ID and Client Secret to Railway environment variables

## Offline Considerations

Since this is a PWA with offline-first requirements:

- **Token Storage**: Store auth tokens in `localStorage` (accessible offline)
- **User Profile Cache**: Cache user profile in IndexedDB for offline access
- **Service Worker Limitation**: Service Worker can't access `localStorage`, so tokens must be passed from client code
- **Token Expiry**: 7-day access tokens work well for offline-first apps (balances security with UX)
- **Refresh Strategy**: Consider implementing token refresh logic for better UX on long sessions

## Security Considerations

### What Makes This Secure?

1. **PKCE Flow**: Protects against authorization code interception attacks
2. **No Client Secret**: Public client (SPA) doesn't need or store secrets
3. **Backend Verification**: Backend verifies the authorization code with Google
4. **Short-lived Tokens**: 7-day access tokens, 30-day refresh tokens
5. **HTTPS Only**: Always use HTTPS in production
6. **HTTPOnly Cookies Alternative**: Consider using HTTPOnly cookies for tokens if you don't need offline access

### Token Storage Trade-offs

**localStorage (Current Implementation):**
- ✅ Works offline
- ✅ Simple implementation
- ✅ Required for PWA offline functionality
- ⚠️ Vulnerable to XSS attacks (mitigate with CSP headers)

**Alternative - HTTPOnly Cookies:**
- ✅ Protected from XSS
- ✅ Automatic inclusion in requests
- ❌ Doesn't work offline
- ❌ Requires CORS configuration
- ❌ Not suitable for offline-first PWAs

**Recommendation**: Use localStorage for this offline-first PWA, but:
- Implement Content Security Policy (CSP) headers
- Sanitize all user inputs
- Keep token expiry short (7 days)
- Monitor for suspicious activity

## Testing

### Development Testing

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
# Click "Sign in with Google"
# Complete OAuth flow
# Verify token is stored in localStorage
```

### Production Testing

```bash
# Build and preview
npm run build
npm run preview

# Test in production mode
# Verify OAuth redirect URIs match production URL
```

### Testing Auth Flow

1. **Login**: Click login → redirects to Google → grants permission → returns to app
2. **Token Storage**: Check DevTools → Application → Local Storage → verify `access_token`
3. **Protected Routes**: Try accessing `/routines` without login → should redirect to `/login`
4. **API Calls**: Check Network tab → verify `Authorization: Bearer <token>` header
5. **Logout**: Click logout → verify tokens cleared from localStorage
6. **Token Expiry**: Set token expiry to 1 minute for testing → verify auto-logout works

## Troubleshooting

### "redirect_uri_mismatch" Error
- Verify redirect URI in Google Cloud Console matches exactly
- Include both dev (`http://localhost:5173/auth/callback`) and prod URIs
- Check for trailing slashes - must match exactly

### "No PKCE verifier found" Error
- PKCE verifier cleared from sessionStorage (user refreshed callback page)
- Solution: Store verifier with timestamp, check expiry

### Tokens Not Persisting
- Check localStorage quota (usually 5-10MB)
- Verify no browser extensions blocking localStorage
- Check incognito mode restrictions

### 401 Unauthorized on API Calls
- Token expired → implement refresh token logic
- Token malformed → check JWT secret matches between client/server
- Token not sent → verify `Authorization` header in API client

## Next Steps

- Implement token refresh logic for better UX
- Add user profile display in UI
- Cache user data in IndexedDB
- Add logout button to UI
- Consider adding email/password auth as fallback
