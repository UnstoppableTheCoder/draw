import { useParams } from "next/navigation";
import { useSetImages, useSetShapes } from "../store/editor/selectors";
import { useEffect } from "react";
import { getPage } from "@/features/page/api/page-api";
import { useCanvasRenderer } from "../context/use-renderer";
import { useImageManager } from "../interactions/manager/image-manager";

export function useLoadPage(imageManager: ReturnType<typeof useImageManager>) {
  const { pageId } = useParams<{ pageId: string }>();
  const renderer = useCanvasRenderer();

  const setShapes = useSetShapes();
  const setImages = useSetImages();

  useEffect(() => {
    if (!pageId) return;

    let cancelled = false;

    const load = async () => {
      const { page, imageAssets } = await getPage(pageId);

      if (cancelled) return;

      await imageManager.preload(imageAssets);

      if (cancelled) return;

      setImages(imageAssets);
      setShapes(page.shapes);

      renderer.invalidate();
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [pageId, renderer, imageManager, setImages, setShapes]);
}
