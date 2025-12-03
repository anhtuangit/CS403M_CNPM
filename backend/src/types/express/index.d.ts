import { JwtPayload } from '../../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      authUser?: JwtPayload;
    }
  }
}

export {};

