import jwt from 'jsonwebtoken';
import env from '../config/env';
import { IUser } from '../models/User';

export interface JwtPayload {
  userId: string;
  role: string;
  email: string;
}

export const signJwt = (user: Pick<IUser, '_id' | 'role' | 'email'>): string => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
    email: user.email
  };
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};

