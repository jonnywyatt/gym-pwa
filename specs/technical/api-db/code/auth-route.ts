// api/src/routes/auth.ts
import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google - Exchange OAuth code for JWT
router.post('/google', async (req, res, next) => {
  try {
    const { code, codeVerifier, redirectUri } = req.body;

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken({
      code,
      codeVerifier,
      redirect_uri: redirectUri
    });

    // Verify ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid token');

    // Upsert user (find or create)
    const user = await prisma.user.upsert({
      where: { googleId: payload.sub },
      update: {
        email: payload.email!,
        name: payload.name,
      },
      create: {
        googleId: payload.sub,
        email: payload.email!,
        name: payload.name,
      }
    });

    // Generate JWT
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '30d' }
    });

    res.json({ accessToken, refreshToken, user });

  } catch (error) {
    next(error);
  }
});

export default router;
