import { Router } from "express";
import { pingHandler } from "../../controllers/v1/ping.controller.js";
import { pingSchema } from "../../validators/ping.validator.js";
import { validateRequestBody } from "../../validators/index.js";

const router = Router();

router.post("/", validateRequestBody(pingSchema), pingHandler);

export default router;
