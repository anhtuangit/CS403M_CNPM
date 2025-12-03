import { Router } from 'express';
import {
  approvePropertyHandler,
  createPropertyHandler,
  deletePropertyHandler,
  getPropertyHandler,
  listPropertiesHandler,
  myPropertiesHandler,
  rejectPropertyHandler,
  updatePropertyHandler
} from '../controllers/propertyController';
import { generateContract, viewContract } from '../controllers/contractController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware';
import { requireRoles } from '../middleware/roleMiddleware';
import { propertyFilterValidator } from '../utils/validators';
import { uploadPropertyImages } from '../middleware/uploadMiddleware';

const router = Router();

// Route list properties: optional auth để admin/staff có thể xem pending properties
router.get('/', optionalAuthMiddleware, propertyFilterValidator, listPropertiesHandler);
router.get('/me', authMiddleware, myPropertiesHandler);
// Upload middleware: field name là 'images', cho phép nhiều file
router.post('/', authMiddleware, uploadPropertyImages.array('images', 5), createPropertyHandler);
router.get('/:id', getPropertyHandler);
router.get('/:id/contract', viewContract);
router.get('/:id/contract/download', generateContract);
router.patch('/:id', authMiddleware, uploadPropertyImages.array('images', 5), updatePropertyHandler);
router.delete('/:id', authMiddleware, deletePropertyHandler);
router.post('/:id/approve', authMiddleware, requireRoles('staff', 'admin'), approvePropertyHandler);
router.post('/:id/reject', authMiddleware, requireRoles('staff', 'admin'), rejectPropertyHandler);

export default router;

