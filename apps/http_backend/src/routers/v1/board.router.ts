import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  createBoard,
  deleteBoard,
  getBoard,
  getBoards,
  updateBoard,
} from "../../controllers/v1/board.controller";
import { createPage, getPages } from "../../controllers/v1/page.controller";
import { createImageAssets } from "../../controllers/v1/image-assets.controller";

const router = Router();

// All board routes require authentication
router.use(authMiddleware);

// GET /boards
router.get("/", getBoards);

// GET /boards/:boardId
router.get("/:boardId", getBoard);

// POST /boards
router.post("/", createBoard);

// PATCH /boards/:boardId
router.patch("/:boardId", updateBoard);

// DELETE /boards/:boardId
router.delete("/:boardId", deleteBoard);

// Get all pages of a board
router.get("/:boardId/pages", getPages);

// Create a page
router.post("/:boardId/pages", createPage);

// Create Image Assets
router.post(`/:boardId/image-assets`, createImageAssets);

// Reorder pages
// router.patch("/:boardId/pages/reorder", reorderPages);

export default router;
