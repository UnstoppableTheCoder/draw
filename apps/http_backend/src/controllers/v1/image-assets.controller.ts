import { prisma } from "@repo/db";
import type { Request, Response } from "express";

export const createImageAssets = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const imageAssets = req.body;

    if (!Array.isArray(imageAssets)) {
      return res.status(400).json({
        message: "Expected an array of image assets.",
      });
    }

    const images = await prisma.imageAsset.createManyAndReturn({
      data: imageAssets.map((image) => ({
        ...image,
        pageId,
      })),
    });

    return res.status(201).json(images);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create image assets.",
    });
  }
};

export const getImageAssets = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;

    const images = await prisma.imageAsset.findMany({
      where: {
        pageId: pageId as string,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.json(images);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch image assets.",
    });
  }
};

export const updateImageAssets = async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        message: "Expected an array of image assets.",
      });
    }

    const images = await prisma.$transaction(
      updates.map(({ id, ...data }) =>
        prisma.imageAsset.update({
          where: { id },
          data,
        }),
      ),
    );

    return res.json(images);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update image assets.",
    });
  }
};

export const deleteImageAssets = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({
        message: "Expected an array of image ids.",
      });
    }

    const result = await prisma.imageAsset.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete image assets.",
    });
  }
};
