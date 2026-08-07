import { useCallback, useEffect } from "react";

import { useLoadBoard } from "./use-load-board";
import { useLoadBoards } from "./use-load-boards";
import { useParams } from "next/navigation";

export function useInitializeEditor() {
  const { boardId } = useParams<{ boardId: string }>();
  const boards = useLoadBoards();
  const board = useLoadBoard(boardId);

  const initialize = useCallback(async () => {
    await Promise.all([boards.load(), board.load()]);
  }, [boards.load, board.load]);

  useEffect(() => {
    initialize().catch(() => {
      // Errors are already handled by the individual hooks.
    });
  }, [initialize]);

  return {
    loading: boards.loading || board.loading,
    error: boards.error ?? board.error,
    reload: initialize,
  };
}
