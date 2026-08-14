import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useCanvasRenderer } from "../context/use-renderer";
import { useImageManager } from "../interactions/manager/image-manager";
import { useClearHistory, useSetShapes } from "../store/editor/selectors";
import { getPageApi } from "../networking/api/page-api";
import { useSetImages } from "../store/board/pages/selectors";

export function useLoadPage(imageManager: ReturnType<typeof useImageManager>) {
  const { pageId } = useParams<{ pageId: string }>();

  const renderer = useCanvasRenderer();

  const setShapes = useSetShapes();
  const setImages = useSetImages();
  const clearHistory = useClearHistory();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!pageId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { page, imageAssets } = await getPageApi(pageId);
      await imageManager.preload(imageAssets);

      console.log("Asset: ", { imageAssets, shapes: page.shapes });

      setImages(imageAssets);
      setShapes(page.shapes);
      clearHistory();

      renderer.invalidate();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pageId, setImages, setShapes, clearHistory]);

  // imageManager, renderer

  useEffect(() => {
    load().catch(() => {
      // Error is already stored in state.
    });
  }, [load]);

  return {
    loading,
    error,
  };
}
