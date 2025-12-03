import { Router } from 'express';
import { listPackagesHandler } from '../controllers/packageController';

const router = Router();

router.get('/', listPackagesHandler);

export default router;

