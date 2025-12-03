import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import User from '../models/User';
import { createSessionCookie, syncGoogleUser, verifyGoogleToken } from '../services/authService';

export const googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createHttpError(400, 'Invalid Google payload'));
  }
  try {
    const { idToken } = req.body;
    const payload = await verifyGoogleToken(idToken);
    const user = await syncGoogleUser(payload);
    const session = createSessionCookie(user);
    res.cookie('token', session.token, session.cookieOptions);
    res.json({ user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) {
      throw createHttpError(401, 'Not authenticated');
    }
    const user = await User.findById(req.authUser.userId).select('-password');
    if (!user) throw createHttpError(404, 'User not found');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
};

