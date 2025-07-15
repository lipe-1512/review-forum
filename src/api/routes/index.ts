import { Router } from 'express';
import userRoutes from './user.routes';
import followRoutes from './follow.routes';
import listRoutes from './list.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/follows', followRoutes);
router.use('/lists', listRoutes);

export default router;
