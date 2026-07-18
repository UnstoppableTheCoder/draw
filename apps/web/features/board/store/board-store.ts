import { Board } from "@/types/board";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type SetStateAction<T> = T | ((prev: T) => T);

interface BoardStore {
  boards: Board[];

  setBoards: (action: SetStateAction<Board[]>) => void;
  addBoard: (board: Board) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  removeBoard: (boardId: string) => void;
  clearBoards: () => void;
}

export const useBoardStore = create<BoardStore>()(
  devtools(
    (set) => ({
      boards: [],

      setBoards: (action) =>
        set(
          (state) => ({
            boards:
              typeof action === "function" ? action(state.boards) : action,
          }),
          false,
          "board/setBoards",
        ),

      addBoard: (board) =>
        set(
          (state) => ({
            boards: [...state.boards, board],
          }),
          false,
          "board/addBoard",
        ),

      updateBoard: (boardId, updates) =>
        set(
          (state) => ({
            boards: state.boards.map((board) =>
              board.id === boardId
                ? {
                    ...board,
                    ...updates,
                  }
                : board,
            ),
          }),
          false,
          "board/updateBoard",
        ),

      removeBoard: (boardId) =>
        set(
          (state) => ({
            boards: state.boards.filter((board) => board.id !== boardId),
          }),
          false,
          "board/removeBoard",
        ),

      clearBoards: () =>
        set(
          {
            boards: [],
          },
          false,
          "board/clearBoards",
        ),
    }),
    {
      name: "board-store",
    },
  ),
);
