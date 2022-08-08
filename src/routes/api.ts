import { Router } from 'express';
import personRoutes from './person';
import studentsRoutes from './sequelize/students';
import userRoutes from './sequelize/users';

const router = Router();
router.use(personRoutes());
router.use(userRoutes());
router.use(studentsRoutes());

export default router;
