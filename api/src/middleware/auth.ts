import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded &&
      'email' in decoded
    ) {
      req.user = {
        userId: decoded.userId as number,
        email: decoded.email as string,
      };
      next();
    } else {
      return res.status(401).json({ error: 'Invalid token payload' });
    }
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
