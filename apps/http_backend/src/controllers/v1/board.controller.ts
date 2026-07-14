import { prisma } from "@repo/db";
import type { Request, Response } from "express";

type BoardParams = {
  boardId: string;
};

export const createBoard = async (req: Request, res: Response) => {
  try {
    const board = await prisma.board.create({
      data: req.body,
    });

    return res.status(201).json(board);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create board.",
    });
  }
};

export const getBoards = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const boards = await prisma.board.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.json(boards);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch boards.",
    });
  }
};

export const getBoard = async (req: Request<BoardParams>, res: Response) => {
  try {
    const { boardId } = req.params;

    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        pages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        imageAssets: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({
        message: "Board not found.",
      });
    }

    return res.json({
      board: {
        id: board.id,
        name: board.name,
        slug: board.slug,
        description: board.description,
        thumbnail: board.thumbnail,
        isPublic: board.isPublic,
        ownerId: board.ownerId,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      },
      pages: board.pages,
      imageAssets: board.imageAssets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load board.",
    });
  }
};

export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;

    const board = await prisma.board.update({
      where: {
        id: boardId as string,
      },
      data: req.body,
    });

    return res.json(board);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update board.",
    });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;

    await prisma.board.delete({
      where: {
        id: boardId as string,
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete board.",
    });
  }
};
