import { Router } from "express";
import healthRouter from "./health.router.js";
import pingRouter from "./ping.router.js";
import imageRouter from "./image.router.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/ping", pingRouter);
router.use("/presign", imageRouter);

export default router;
