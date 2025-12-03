import { Router } from 'express';
import { googleSignIn, logout, me } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { googleAuthValidator } from '../utils/validators';

const router = Router();

router.post('/google', googleAuthValidator, googleSignIn);
router.get('/me', authMiddleware, me);
router.post('/logout', logout);

export default router;

