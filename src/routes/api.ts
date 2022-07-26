import { Router } from "express";
import peronRoutes from "./person";

const router = Router();
router.use(peronRoutes());

export default router;
