import { Router } from "express";
import { getHealth } from "../../controllers/v1/health.controller.js";
import { presignUrl } from "../../controllers/v1/image.controller.js";

const router = Router();

router.post("/", presignUrl);

export default router;
