import { useShallow } from "zustand/react/shallow";
import { usePageStore } from "./page-store";

export const usePages = () => usePageStore((state) => state.pages);

export const useCurrentPageId = () =>
  usePageStore((state) => state.currentPageId);

export const useCurrentPage = () =>
  usePageStore(
    useShallow(
      (state) =>
        state.pages.find((page) => page.id === state.currentPageId) ?? null,
    ),
  );

export const useSetPages = () => usePageStore((state) => state.setPages);

export const useAddPage = () => usePageStore((state) => state.addPage);

export const useUpdatePage = () => usePageStore((state) => state.updatePage);

export const useRemovePage = () => usePageStore((state) => state.removePage);

export const useReorderPages = () =>
  usePageStore((state) => state.reorderPages);

export const useSetCurrentPageId = () =>
  usePageStore((state) => state.setCurrentPageId);

// Images
export const useImages = () => usePageStore((state) => state.images);

export const useImage = (imageId: string) =>
  usePageStore((state) => state.images[imageId]);

export const useHasImage = (imageId: string) =>
  usePageStore((state) => imageId in state.images);

export const useSetImages = () => usePageStore((state) => state.setImages);

export const useAddImage = () => usePageStore((state) => state.addImage);

export const useRemoveImage = () => usePageStore((state) => state.removeImage);

export const useClearImages = () => usePageStore((state) => state.clearImages);
