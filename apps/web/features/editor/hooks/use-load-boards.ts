import { useCallback, useState } from "react";

import { getBoards } from "@/features/board/api/board-api";
import { useBoards, useSetBoards } from "@/features/board/store/selectors";

export const useLoadBoards = () => {
  const boards = useBoards();
  const setBoards = useSetBoards();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (boards.length > 0) {
      return boards;
    }

    try {
      setLoading(true);
      setError(null);

      const { boards: fetchedBoards } = await getBoards();

      setBoards(fetchedBoards);

      return fetchedBoards;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [boards, setBoards]);

  return {
    loading,
    error,
    load,
  };
};
