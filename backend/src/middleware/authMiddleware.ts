import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { verifyJwt } from '../utils/jwt';
import User from '../models/User';

// Helper function để lấy user info từ token
const getUserFromToken = async (token: string) => {
  try {
    const jwtPayload = verifyJwt(token);
    const user = await User.findById(jwtPayload.userId).select('role status');
    if (!user) {
      return null;
    }
    if (user.status === 'locked') {
      return null;
    }
    return {
      userId: jwtPayload.userId,
      role: user.role,
      email: jwtPayload.email
    };
  } catch (error) {
    return null;
  }
};

// Middleware bắt buộc authentication
export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    return next(createHttpError(401, 'Authentication required'));
  }
  
  const userInfo = await getUserFromToken(token);
  if (!userInfo) {
    return next(createHttpError(401, 'Invalid session'));
  }
  
  req.authUser = userInfo;
  return next();
};

// Middleware optional authentication - không bắt buộc đăng nhập nhưng sẽ set req.authUser nếu có token hợp lệ
export const optionalAuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (token) {
    const userInfo = await getUserFromToken(token);
    if (userInfo) {
      req.authUser = userInfo;
    }
  }
  return next();
};

