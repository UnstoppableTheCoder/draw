import { useCallback, useEffect, useState } from "react";
import { useSetShapes } from "../store/editor/selectors";
import { useSetPages } from "@/features/page/store/selectors";
import { useParams } from "next/navigation";
import { getPages } from "@/features/page/api/page-api";
import { getBoards } from "@/features/board/api/board-api";
import { useSetBoards } from "@/features/board/store/selectors";

export const useLoadBoard = () => {
  const setShapes = useSetShapes();
  const setPages = useSetPages();
  const setBoards = useSetBoards();
  const { boardId, pageId } = useParams<{ boardId: string; pageId: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { boards } = await getBoards();
      const { pages } = await getPages(boardId);

      setBoards(boards);
      setPages(pages);
      // Later:
      //   const images = await getImageAssets(pageId);
      //   setImageAssets(images);

      // const comments = await getComments(pageId);
      // setComments(comments);

      // websocket.join(pageId);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [pageId, setShapes]);

  useEffect(() => {
    loadPage();

    return () => {
      // Later:
      // websocket.leave(pageId);
      // clearSelections();
    };
  }, [loadPage]);

  return {
    loading,
    error,
    reload: loadPage,
  };
};
