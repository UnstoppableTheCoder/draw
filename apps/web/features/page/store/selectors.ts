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
