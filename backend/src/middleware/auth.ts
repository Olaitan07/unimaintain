import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type UserRole = 'STUDENT' | 'STAFF' | 'OFFICER' | 'ADMIN';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET must be defined in environment');
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization header is missing or invalid' });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, jwtSecret as jwt.Secret) as unknown as AuthUser;
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    return next();
  };
}
