import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404, 'Route not found'));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;
  res.status(status).json({ message, stack });
};

