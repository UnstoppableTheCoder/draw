import { useBoardStore } from "./board-store";

export const useBoards = () => useBoardStore((state) => state.boards);

export const useSetBoards = () => useBoardStore((state) => state.setBoards);

export const useAddBoard = () => useBoardStore((state) => state.addBoard);

export const useUpdateBoard = () => useBoardStore((state) => state.updateBoard);

export const useRemoveBoard = () => useBoardStore((state) => state.removeBoard);

export const useClearBoards = () => useBoardStore((state) => state.clearBoards);
