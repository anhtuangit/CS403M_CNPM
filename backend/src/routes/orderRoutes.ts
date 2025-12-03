import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { createOrderHandler, myOrdersHandler } from '../controllers/orderController';

const router = Router();

router.use(authMiddleware);
router.post('/', createOrderHandler);
router.get('/me', myOrdersHandler);

export default router;

