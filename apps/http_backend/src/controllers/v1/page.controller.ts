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

    return res.status(201).json(page);
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

    return res.json(pages);
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

    const imageAssets = await prisma.imageAsset.findMany({
      where: {
        boardId: page.boardId as string,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.json({
      page: {
        id: page.id,
        name: page.name,
        boardId: page.boardId,
      },
      shapes: page.shapes,
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

    return res.json(page);
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
