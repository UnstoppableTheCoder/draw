import { useCallback, useRef } from "react";
import { ImageAsset } from "../../types";
import { ImageMap } from "../../store/editor/editor-types";

type CachedImage = {
  image: HTMLImageElement;
  status: "loading" | "loaded" | "error";
};

export const useImageManager = () => {
  const cacheRef = useRef(new Map<string, CachedImage>());

  const load = useCallback(async (asset: ImageAsset): Promise<void> => {
    const cached = cacheRef.current.get(asset.id);

    if (cached) {
      if (cached.status === "loaded") return;

      await cached.image.decode().catch(() => {});
      return;
    }

    const url = asset.renderUrl || asset.publicUrl;
    if (!url) return;

    const image = new Image();

    cacheRef.current.set(asset.id, {
      image,
      status: "loading",
    });
    image.src = url;

    try {
      await image.decode();

      const entry = cacheRef.current.get(asset.id);
      if (entry) {
        entry.status = "loaded";
      }
    } catch {
      const entry = cacheRef.current.get(asset.id);
      if (entry) {
        entry.status = "error";
      }
    }
  }, []);

  const preload = useCallback(
    async (imageMap: ImageMap) => {
      await Promise.all(Object.values(imageMap).map(load));
    },
    [load],
  );

  const get = useCallback((imageId: string) => {
    return cacheRef.current.get(imageId);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    load,
    preload,
    get,
    clear,
  };
};
