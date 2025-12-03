import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRoles } from '../middleware/roleMiddleware';
import { dashboardStats, listOrders, listUsers, markOrderPaidHandler, toggleUserStatus } from '../controllers/adminController';

const router = Router();

// Tất cả routes admin đều cần auth
router.use(authMiddleware);

// Stats, orders: staff và admin đều xem được
router.get('/stats', requireRoles('staff', 'admin'), dashboardStats);
router.get('/orders', requireRoles('staff', 'admin'), listOrders);
router.post('/orders/:id/mark-paid', requireRoles('staff', 'admin'), markOrderPaidHandler);

// Chỉ admin mới xem được danh sách người dùng
router.get('/users', requireRoles('admin'), listUsers);

// Chỉ admin mới có quyền khóa/mở khóa user
router.patch('/users/:id/toggle', requireRoles('admin'), toggleUserStatus);

export default router;

