import { StateCreator } from "zustand";
import { EditorStore, ImageMap } from "../editor-types";

export const createImageSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<
    EditorStore,
    "images" | "setImages" | "addImage" | "removeImage" | "clearImages"
  >
> = (set) => ({
  images: {} as ImageMap,

  setImages: (updater) =>
    set(
      (state) => ({
        images: typeof updater === "function" ? updater(state.images) : updater,
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
});
