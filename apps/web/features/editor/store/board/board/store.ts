import { BoardStore } from "./types";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useBoardStore = create<BoardStore>()(
  devtools(
    (set) => ({
      board: null,

      setBoard: (board) => set({ board }, false, "board/setBoard"),

      clearBoard: () =>
        set(
          {
            board: null,
          },
          false,
          "board/clearBoard",
        ),
    }),
    {
      name: "board-store",
    },
  ),
);
