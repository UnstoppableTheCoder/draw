import { useCallback, useEffect, useState } from "react";
import { useSetShapes } from "../store/editor/selectors";
import { getShapes } from "../networking/api/shape-api";

export const useLoadPage = (pageId: string) => {
  const setShapes = useSetShapes();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const shapes = await getShapes(pageId);
      setShapes(shapes);

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
