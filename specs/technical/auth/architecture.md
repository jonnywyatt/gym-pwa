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
