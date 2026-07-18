import { prisma } from "@repo/db";
import type { Request, Response } from "express";

export const createImageAssets = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const imageAssets = req.body;

    if (!Array.isArray(imageAssets)) {
      return res.status(400).json({
        message: "Expected an array of image assets.",
      });
    }

    const images = await prisma.imageAsset.createManyAndReturn({
      data: imageAssets.map((image) => ({
        ...image,
        boardId,
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

export const createImageAsset = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;

    const image = await prisma.imageAsset.create({
      data: {
        ...req.body,
        boardId,
      },
    });

    return res.status(201).json(image);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create image asset.",
    });
  }
};

export const getImageAssets = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;

    const images = await prisma.imageAsset.findMany({
      where: {
        boardId: boardId as string,
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

export const updateImageAsset = async (req: Request, res: Response) => {
  try {
    const { id, imageId, ...data } = req.params;

    const image = await prisma.imageAsset.update({
      where: {
        id: imageId as string,
      },
      data,
    });

    return res.json(image);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update image asset.",
    });
  }
};

export const deleteImageAsset = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;

    await prisma.imageAsset.delete({
      where: {
        id: imageId as string,
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete image asset.",
    });
  }
};
