import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  createShapes,
  deletePage,
  getPage,
  updatePage,
} from "../../controllers/v1/page.controller";
import {
  deleteShapes,
  updateShapes,
} from "../../controllers/v1/shape.controller";

const router = Router();

router.use(authMiddleware);

// Get a single page
router.get("/:pageId", getPage);

// Update page
router.patch("/:pageId", updatePage);

// Delete page
router.delete("/:pageId", deletePage);

// Create Shapes
router.post("/:pageId/shapes", createShapes);

// Update Shapes
router.patch("/:pageId/shapes", updateShapes);

// Delete Shapes
router.delete("/:pageId/shapes", deleteShapes);

// Duplicate page
// router.post("/:pageId/duplicate", duplicatePage);

// Move page to another board
// router.patch("/:pageId/move", movePage);

export default router;
