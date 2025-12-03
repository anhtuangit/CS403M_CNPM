import { OAuth2Client, TokenPayload } from 'google-auth-library';
import createHttpError from 'http-errors';
import env from '../config/env';
import User, { IUser } from '../models/User';
import { signJwt } from '../utils/jwt';

const googleClient = new OAuth2Client(env.googleClientId);
const FREE_LISTING_LIMIT = 3;

export const verifyGoogleToken = async (idToken: string): Promise<TokenPayload> => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.googleClientId
  });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw createHttpError(400, 'Không xác thực được email Google');
  }
  return payload;
};

export const syncGoogleUser = async (payload: TokenPayload): Promise<IUser> => {
  const user = await User.findOneAndUpdate(
    { email: payload.email },
    {
      $setOnInsert: {
        name: payload.name ?? payload.email?.split('@')[0],
        role: 'user',
        freeListingsRemaining: FREE_LISTING_LIMIT
      },
      $set: {
        googleId: payload.sub,
        avatar: payload.picture
      }
    },
    { new: true, upsert: true }
  );
  if (!user) {
    throw createHttpError(500, 'Không tạo được người dùng');
  }
  return user;
};

export const createSessionCookie = (user: IUser) => {
  const token = signJwt({ _id: user._id, role: user.role, email: user.email });
  return {
    token,
    cookieOptions: {
      // JWT lưu trong cookie httpOnly để tránh XSS. secure chỉ bật ở production.
      // sameSite: 'strict' trong production để giảm CSRF, 'lax' cho dev dễ test từ localhost.
      httpOnly: true,
      secure: env.cookie.secure,
      sameSite: env.cookie.sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: env.cookie.domain,
      path: '/'
    }
  };
};

export const ensureAdminSeed = async (): Promise<void> => {
  const existing = await User.findOne({ email: env.defaults.adminEmail });
  if (existing) return;

  await User.create({
    name: 'Marketplace Admin',
    email: env.defaults.adminEmail,
    role: 'admin',
    password: env.defaults.adminPassword,
    freeListingsRemaining: 0,
    paidListingsRemaining: 999
  });
  console.log('Seeded default admin:', env.defaults.adminEmail);
};

