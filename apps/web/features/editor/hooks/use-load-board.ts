import { useCallback, useState } from "react";

import { getBoard, getBoards } from "@/features/board/api/board-api";
import { useBoards, useSetBoards } from "@/features/board/store/selectors";

import { useSetPages } from "../store/board/pages/selectors";
import { useSetBoard } from "../store/board/board/selectors";

export const useLoadBoard = (boardId: string) => {
  const boards = useBoards();
  const setBoards = useSetBoards();
  const setPages = useSetPages();
  const setBoard = useSetBoard();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!boardId) return;

    try {
      setLoading(true);
      setError(null);

      const [boardResponse, boardsResponse] = await Promise.all([
        getBoard(boardId),
        boards.length === 0 ? getBoards() : Promise.resolve(null),
      ]);

      const { board, pages, members } = boardResponse;
      setBoard(board);
      setPages(pages);

      if (boardsResponse) {
        setBoards(boardsResponse.boards);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [boardId, boards.length, setBoards, setPages]);

  // useEffect(() => {
  //   loadBoard();
  // }, [loadBoard]);

  return {
    loading,
    error,
    load,
  };
};
