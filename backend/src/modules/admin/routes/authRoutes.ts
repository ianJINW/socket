import { Router } from 'express';
import { z } from 'zod';
import { login, refreshToken, createUser } from '../services/authService';
import { authenticate, authorize } from '../../../middlewares/auth';
import { asyncHandler } from '../../../utils/errors';
import { AuthRequest, UserRole } from '../../../types';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.nativeEnum(UserRole),
});

router.post('/login', asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const result = await login(data.email, data.password);
  res.json({ data: result });
}));

router.post('/refresh', asyncHandler(async (req, res) => {
  const data = refreshSchema.parse(req.body);
  const result = await refreshToken(data.refreshToken);
  res.json({ data: result });
}));

router.post('/logout', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  // In a production system, you would invalidate the refresh token here
  // For now, we'll just return success
  res.json({ data: { success: true } });
}));

router.post('/register', authenticate, authorize('admin'), asyncHandler(async (req: AuthRequest, res: any) => {
  const parsed = createUserSchema.parse(req.body);
  const user = await createUser({
    email: parsed.email,
    password: parsed.password,
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    role: parsed.role,
  });
  res.status(201).json({ data: user });
}));

export default router;
