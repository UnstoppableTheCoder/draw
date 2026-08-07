import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getBoards } from "@/features/board/api/board-api";
import { useBoards, useSetBoards } from "@/features/board/store/selectors";

import { useSetPages } from "@/features/page/store/selectors";
import { getPagesApi } from "@/features/page/api/page-api";

export const useLoadBoard = (boardId: string) => {
  const boards = useBoards();
  const setBoards = useSetBoards();
  const setPages = useSetPages();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!boardId) return;

    try {
      setLoading(true);
      setError(null);

      const [pagesResponse, boardsResponse] = await Promise.all([
        getPagesApi(boardId),
        boards.length === 0 ? getBoards() : Promise.resolve(null),
      ]);

      setPages(pagesResponse.pages);

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
