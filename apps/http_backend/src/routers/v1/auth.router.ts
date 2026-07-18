import { Router } from "express";
import {
  me,
  signin,
  signout,
  signup,
} from "../../controllers/v1/auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", signin);
router.post("/logout", signout);
router.get("/me", authMiddleware, me);

export default router;
