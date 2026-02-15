import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

const mockApiUrl = 'http://localhost:3000';

export const handlers = [
  http.get(`${mockApiUrl}/exercises`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }
    return HttpResponse.json([]);
  }),

  http.post(`${mockApiUrl}/auth/google`, async ({ request }) => {
    const body = (await request.json()) as {
      code?: string;
      codeVerifier?: string;
      redirectUri?: string;
    };
    if (!body.code || !body.codeVerifier) {
      return HttpResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
    });
  }),

  http.get(`${mockApiUrl}/users/:userId`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json({
      id: 1,
      name: 'Test User',
      latestBodyWeight: null,
    });
  }),

  http.post(`${mockApiUrl}/users/:userId/body-weights`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = (await request.json()) as { weightKg?: number };
    return HttpResponse.json({ weightKg: String(body.weightKg) }, { status: 201 });
  }),
];

export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
  server.close();
});
