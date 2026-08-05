import { prisma } from "@repo/db";
import type { Request, Response } from "express";

export const createPage = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;

    const page = await prisma.page.create({
      data: {
        ...req.body,
        boardId,
      },
    });

    return res.status(201).json({ page });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create page.",
    });
  }
};

export const getPages = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;

    const pages = await prisma.page.findMany({
      where: {
        boardId: boardId as string,
      },
    });

    return res.json({ pages });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch pages.",
    });
  }
};

export const getPage = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;

    const page = await prisma.page.findUnique({
      where: {
        id: pageId as string,
      },
      include: {
        shapes: {
          where: {
            isDeleted: false,
          },
          orderBy: {
            zIndex: "asc",
          },
        },
      },
    });

    if (!page) {
      return res.status(404).json({
        message: "Page not found.",
      });
    }

    const imageAssetsData = await prisma.imageAsset.findMany({
      where: {
        boardId: page.boardId as string,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const imageAssets = Object.fromEntries(
      imageAssetsData.map((image) => [image.id, image]),
    );

    return res.json({
      page,
      imageAssets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load page.",
    });
  }
};

export const updatePage = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;

    const page = await prisma.page.update({
      where: {
        id: pageId as string,
      },
      data: req.body,
    });

    return res.json({ page });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update page.",
    });
  }
};

export const deletePage = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;

    await prisma.page.delete({
      where: {
        id: pageId as string,
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete page.",
    });
  }
};

export const createShapes = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const { shapes } = req.body;

    if (!Array.isArray(shapes) || shapes.length === 0) {
      return res.status(400).json({
        message: "Shapes array is required.",
      });
    }

    const createdShapes = await prisma.shape.createManyAndReturn({
      data: shapes.map((shape) => ({
        ...shape,
        pageId,
      })),
    });

    return res.status(201).json({
      shapes: createdShapes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create shapes.",
    });
  }
};
