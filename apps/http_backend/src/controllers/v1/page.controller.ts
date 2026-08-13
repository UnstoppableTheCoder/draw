import { Prisma, prisma } from "@repo/db";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

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
      orderBy: {
        orderKey: "asc",
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
        pageId: pageId as string,
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

export const duplicatePage = async (req: Request, res: Response) => {
  const shapeIdMap = new Map<string, string>();
  const groupIdMap = new Map<string, string>();
  const imageAssetIdMap = new Map<string, string>();

  try {
    const { pageId } = req.params;

    const page = await prisma.page.findUnique({
      where: {
        id: pageId as string,
      },
      include: {
        shapes: true,
        imageAssets: true,
      },
    });

    if (!page) {
      return res.status(404).json({
        message: "Page not found.",
      });
    }

    // Creating new ids for shapes
    page.shapes.forEach((shape) => {
      if (shape) {
        shapeIdMap.set(shape.id, uuidv4());
      }

      if (shape.groupId) {
        groupIdMap.set(shape.groupId, uuidv4());
      }
    });

    // Creating new ids for image assets
    page.imageAssets.forEach((asset) => {
      if (asset) {
        imageAssetIdMap.set(asset.id, uuidv4());
      }
    });

    const duplicatedPage = await prisma.$transaction(async (tx) => {
      const { id, createdAt, updatedAt, shapes, imageAssets, ...pageData } =
        page;

      // Create the new page
      const newPage = await tx.page.create({
        data: {
          ...pageData,
          name: `${page.name} Copy`,
        },
      });

      const newImageAssets = await tx.imageAsset.createManyAndReturn({
        data: imageAssets.map(({ id, pageId, ...imageAsset }) => ({
          id: imageAssetIdMap.get(id) ?? uuidv4(),
          ...imageAsset,
          pageId: newPage.id,
        })),
      });

      // Duplicate all shapes
      const newShapes = await tx.shape.createManyAndReturn({
        data: shapes.map(({ id, pageId, createdAt, updatedAt, ...shape }) => {
          let data = shape.data;

          if (
            shape.type === "image" &&
            shape.data !== null &&
            typeof shape.data === "object" &&
            !Array.isArray(shape.data) &&
            "imageId" in shape.data
          ) {
            const imageAssetId = shape.data.imageId as string;

            data = {
              ...shape.data,
              imageId: imageAssetIdMap.get(imageAssetId),
            };
          }

          return {
            id: shapeIdMap.get(id) ?? uuidv4(),
            ...shape,
            pageId: newPage.id,
            appearance: shape.appearance as Prisma.InputJsonValue,
            data: data as Prisma.InputJsonValue,
            frameId: shape.frameId ? shapeIdMap.get(shape.frameId) : null,
            groupId: shape.groupId ? groupIdMap.get(shape.groupId) : null,
          };
        }),
      });

      return {
        page: {
          ...newPage,
          shapes: newShapes,
        },
        imageAssets: newImageAssets,
      };
    });

    return res.status(201).json({
      ...duplicatedPage,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to duplicate page.",
    });
  }
};

export const movePage = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const { boardId } = req.body;

    const page = await prisma.page.update({
      where: {
        id: pageId as string,
      },
      data: {
        boardId,
      },
    });

    return res.json({
      page,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to move page.",
    });
  }
};
