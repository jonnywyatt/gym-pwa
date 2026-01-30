# Authentication tech choices

This document covers client-side authentication implementation for the gym PWA using OAuth 2.0 PKCE flow with Google.

See [client-app.md](../client-app/index.md) for general client app setup and [remote-database.md](../api-db/index.md) for backend implementation.

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
