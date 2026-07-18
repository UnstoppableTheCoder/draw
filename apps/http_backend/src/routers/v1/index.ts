import { Router } from "express";
import healthRouter from "./health.router.js";
import pingRouter from "./ping.router.js";
import imageRouter from "./image.router.js";
import authRouter from "./auth.router.js";
import boardRouter from "./board.router.js";
import pageRouter from "./page.router.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/ping", pingRouter);
router.use("/presign", imageRouter);
router.use("/auth", authRouter);
router.use("/boards", boardRouter);
router.use("/pages", pageRouter);

export default router;
