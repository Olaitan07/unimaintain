import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { registerSchema, loginSchema } from '../validators/auth';
import { validateBody } from '../middleware/validate';
import { successResponse } from '../utils/response';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET must be defined in environment');
}

router.post('/register', validateBody(registerSchema), async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: 'STUDENT' }
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, {
      expiresIn: '7d'
    });

    return res.status(201).json(successResponse({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } }));
  } catch (error) {
    return next(error);
  }
});

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, {
      expiresIn: '7d'
    });

    return res.json(successResponse({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
    }));
  } catch (error) {
    return next(error);
  }
});

router.get('/me', authenticateJWT, async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  return res.json(successResponse({ user }));
});

export default router;
