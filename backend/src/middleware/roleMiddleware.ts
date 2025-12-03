import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const requireRoles = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return next(createHttpError(401, 'Authentication required'));
    }
    
    // Kiểm tra role có trong danh sách được phép không
    if (!roles.includes(req.authUser.role)) {
      return next(createHttpError(403, `Insufficient permissions. Required roles: ${roles.join(', ')}. Your role: ${req.authUser.role}`));
    }
    
    return next();
  };
};

