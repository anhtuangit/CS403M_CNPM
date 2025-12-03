import { Request, Response, NextFunction } from 'express';
import { listActivePackages } from '../services/packageService';

export const listPackagesHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const packages = await listActivePackages();
    res.json(packages);
  } catch (error) {
    next(error);
  }
};

