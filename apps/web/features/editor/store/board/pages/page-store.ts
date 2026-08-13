import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Page } from "../../types/page";

type SetStateAction<T> = T | ((prev: T) => T);

interface PageStore {
  pages: Page[];
  currentPageId: string | null;

  setPages: (action: SetStateAction<Page[]>) => void;
  addPage: (page: Page) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  removePage: (pageId: string) => void;
  reorderPages: (action: SetStateAction<Page[]>) => void;
  setCurrentPageId: (pageId: string | null) => void;
  clear: () => void;
}

export const usePageStore = create<PageStore>()(
  devtools(
    (set) => ({
      pages: [],
      currentPageId: null,

      setPages: (action) =>
        set(
          (state) => ({
            pages: typeof action === "function" ? action(state.pages) : action,
          }),
          false,
          "page/setPages",
        ),

      addPage: (page) =>
        set(
          (state) => ({
            pages: [...state.pages, page],
          }),
          false,
          "page/addPage",
        ),

      updatePage: (pageId, updates) =>
        set(
          (state) => ({
            pages: state.pages.map((page) =>
              page.id === pageId
                ? {
                    ...page,
                    ...updates,
                  }
                : page,
            ),
          }),
          false,
          "page/updatePage",
        ),

      removePage: (pageId) =>
        set(
          (state) => ({
            pages: state.pages.filter((page) => page.id !== pageId),
            currentPageId:
              state.currentPageId === pageId ? null : state.currentPageId,
          }),
          false,
          "page/removePage",
        ),

      reorderPages: (action) =>
        set(
          (state) => ({
            pages: typeof action === "function" ? action(state.pages) : action,
          }),
          false,
          "page/reorderPages",
        ),

      setCurrentPageId: (currentPageId) =>
        set(
          {
            currentPageId,
          },
          false,
          "page/setCurrentPageId",
        ),

      clear: () =>
        set(
          {
            pages: [],
            currentPageId: null,
          },
          false,
          "page/clear",
        ),
    }),
    {
      name: "page-store",
    },
  ),
);
