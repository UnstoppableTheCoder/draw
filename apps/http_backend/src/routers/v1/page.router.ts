import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  deletePage,
  duplicatePage,
  getPage,
  movePage,
  updatePage,
} from "../../controllers/v1/page.controller";
import {
  createShapes,
  deleteShapes,
  updateShapes,
} from "../../controllers/v1/shape.controller";
import {
  createImageAssets,
  deleteImageAssets,
  getImageAssets,
  updateImageAssets,
} from "../../controllers/v1/image-assets.controller";

const router = Router();

router.use(authMiddleware);

// --------------------
// Pages
// --------------------

// Get a single page
router.get("/:pageId", getPage);

// Update page
router.patch("/:pageId", updatePage);

// Delete page
router.delete("/:pageId", deletePage);

// Duplicate page
router.post("/:pageId/duplicate", duplicatePage);

// Move page to another board
router.patch("/:pageId/move", movePage);

// --------------------
// Shapes
// --------------------

// Create shapes
router.post("/:pageId/shapes", createShapes);

// Update shapes
router.patch("/:pageId/shapes", updateShapes);

// Delete shapes
router.delete("/:pageId/shapes", deleteShapes);

// --------------------
// Image Assets
// --------------------

// Get all image assets for a page
router.get("/:pageId/image-assets", getImageAssets);

// Bulk create image assets
router.post("/:pageId/image-assets", createImageAssets);

// Update an image asset
router.patch("/:pageId/image-assets/:imageId", updateImageAssets);

// Delete an image asset
router.delete("/:pageId/image-assets/:imageId", deleteImageAssets);

export default router;
