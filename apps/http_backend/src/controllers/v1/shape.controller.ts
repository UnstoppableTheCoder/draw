import { prisma } from "@repo/db";
import type { Request, Response } from "express";

// export type ShapeUpdate = Omit<
//   Shape,
//   "pageId" | "createdById" | "createdAt" | "updatedAt" | "comments"
// >;

export const createShape = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;

    const shape = await prisma.shape.create({
      data: {
        ...req.body,
        pageId,
      },
    });

    return res.status(201).json(shape);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create shape.",
    });
  }
};

export const getShapes = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;

    const shapes = await prisma.shape.findMany({
      where: {
        pageId: pageId as string,
        isDeleted: false,
      },
      orderBy: {
        zIndex: "asc",
      },
    });

    return res.json(shapes);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch shapes.",
    });
  }
};

export const updateShapes = async (req: Request, res: Response) => {
  try {
    const shapes = req.body as any[];

    const updatedShapes = await prisma.$transaction(
      shapes.map((shape) => {
        const {
          id,
          pageId,
          createdById,
          createdAt,
          updatedAt,
          comments,
          ...data
        } = shape;

        return prisma.shape.update({
          where: {
            id,
          },
          data,
        });
      }),
    );

    return res.status(200).json({ shapes: updatedShapes });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update shapes.",
    });
  }
};

export const deleteShapes = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body as {
      ids: string[];
    };

    await prisma.shape.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        isDeleted: true,
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete shapes.",
    });
  }
};
