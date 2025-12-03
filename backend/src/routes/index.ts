import { Router } from 'express';
import authRoutes from './authRoutes';
import propertyRoutes from './propertyRoutes';
import adminRoutes from './adminRoutes';
import orderRoutes from './orderRoutes';
import packageRoutes from './packageRoutes';
import chatRoutes from './chatRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/admin', adminRoutes);
router.use('/orders', orderRoutes);
router.use('/packages', packageRoutes);
router.use('/chat', chatRoutes);

export default router;

