import * as oauth from 'oauth4webapi';
import { config } from '../../config';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_ISSUER = 'https://accounts.google.com';

export class OAuthService {
  private client: oauth.Client;
  private authServer: oauth.AuthorizationServer;

  constructor() {
    this.client = {
      client_id: config.googleClientId,
      token_endpoint_auth_method: 'none', // PKCE (public client)
    };

    this.authServer = {
      issuer: GOOGLE_ISSUER,
      authorization_endpoint: GOOGLE_AUTH_URL,
      token_endpoint: GOOGLE_TOKEN_URL,
    };
  }

  async initiateLogin(): Promise<void> {
    // Generate PKCE challenge
    const codeVerifier = oauth.generateRandomCodeVerifier();
    const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);

    // Store verifier for callback
    sessionStorage.setItem('pkce_code_verifier', codeVerifier);

    // Build authorization URL
    const endpoint = this.authServer.authorization_endpoint;
    if (!endpoint) {
      throw new Error('Authorization endpoint not configured');
    }

    const authUrl = new URL(endpoint);
    authUrl.searchParams.set('client_id', this.client.client_id);
    authUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile email');
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    // Redirect to Google
    window.location.href = authUrl.toString();
  }

  async handleCallback(
    code: string
  ): Promise<{ accessToken: string; refreshToken?: string; hasBodyWeight: boolean }> {
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

    if (!codeVerifier) {
      throw new Error('No PKCE verifier found');
    }

    // Exchange code for tokens at your backend
    const response = await fetch(`${config.apiUrl}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        codeVerifier,
        redirectUri: `${window.location.origin}/auth/callback`,
      }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const { accessToken, refreshToken, user, hasBodyWeight } = await response.json();

    // Store tokens
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }

    // Store user info
    if (user) {
      localStorage.setItem('user_id', String(user.id));
      localStorage.setItem('user_name', user.name ?? '');
    }

    // Clean up
    sessionStorage.removeItem('pkce_code_verifier');

    return { accessToken, refreshToken, hasBodyWeight };
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('user_id');
    return id ? Number(id) : null;
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new OAuthService();
