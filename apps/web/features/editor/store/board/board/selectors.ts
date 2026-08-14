import { useBoardStore } from "./store";

export const useBoard = () => useBoardStore((state) => state.board);

export const useSetBoard = () => useBoardStore((state) => state.setBoard);

export const useClearBoard = () => useBoardStore((state) => state.clearBoard);
