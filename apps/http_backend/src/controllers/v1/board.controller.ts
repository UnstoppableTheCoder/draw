import { prisma } from "@repo/db";
import type { Request, Response } from "express";

type BoardParams = {
  boardId: string;
};

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { backgroundColor } = req.body;

    // Assuming auth middleware sets req.user
    const userId = req.user.id;

    const board = await prisma.$transaction(async (tx) => {
      // Create board
      const board = await tx.board.create({
        data: req.body,
      });

      // Add creator as owner
      await tx.boardMember.create({
        data: {
          boardId: board.id,
          userId,
          role: req.role,
        },
      });

      // Create first page
      const page = await tx.page.create({
        data: {
          boardId: board.id,
          name: "Page 1",
          orderKey: "a0",
          backgroundColor: backgroundColor ?? null,
          createdById: userId,
        },
      });

      return {
        ...board,
        pages: [page],
      };
    });

    return res.status(201).json({
      board,
    });
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

    return res.json({ boards });
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

    const imageMap = Object.fromEntries(
      board.imageAssets.map((image) => [image.id, image]),
    );

    return res.json({
      board: {
        id: board.id,
        name: board.name,
        description: board.description,
        thumbnail: board.thumbnail,
        isPublic: board.isPublic,
        ownerId: board.ownerId,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      },
      pages: board.pages,
      imageMap,
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

    return res.json({ board });
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
