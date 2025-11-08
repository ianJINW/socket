import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import User from '../models/User';
import { JWTPayload, UserRole } from '../../../types';
import { AppError } from '../../../utils/errors';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

export const generateTokens = (payload: { id: string; email: string; role: string }): { accessToken: string; refreshToken: string } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessToken: any = jwt.sign(
    { sub: payload.id, email: payload.email, role: payload.role },
    config.jwt.secret,
    { expiresIn: config.jwt.accessTokenTtl }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refreshToken: any = jwt.sign(
    { sub: payload.id, type: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshTokenTtl }
  );

  return { accessToken: String(accessToken), refreshToken: String(refreshToken) };
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !user.isActive) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const tokens = generateTokens({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    ...tokens,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
};

export const refreshToken = async (token: string): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as { sub: string; type?: string };
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Invalid refresh token');
    }

    return generateTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Invalid refresh token');
  }
};

export const createUser = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}): Promise<any> => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new AppError(409, 'USER_EXISTS', 'User with this email already exists');
  }

  const user = new User(data);
  await user.save();

  return {
    id: (user as any)._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
};
