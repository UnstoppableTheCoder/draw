import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ImageMap, PageStore } from "./types";

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

      // Images
      images: {} as ImageMap,

      setImages: (updater) =>
        set(
          (state) => ({
            images:
              typeof updater === "function" ? updater(state.images) : updater,
          }),
          false,
          "images/setImages",
        ),

      addImage: (image) =>
        set(
          (state) => ({
            images: {
              ...state.images,
              [image.id]: image,
            },
          }),
          false,
          "images/addImage",
        ),

      removeImage: (imageId: string) =>
        set(
          (state) => {
            const nextImages = { ...state.images };
            delete nextImages[imageId];

            return {
              images: nextImages,
            };
          },
          false,
          "images/removeImage",
        ),

      clearImages: () =>
        set(
          {
            images: {},
          },
          false,
          "images/clearImages",
        ),
    }),
    {
      name: "page-store",
    },
  ),
);
