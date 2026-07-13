import { useShallow } from "zustand/react/shallow";
import { useEditorStore } from "../editor-store";

// State
export const useImages = () =>
  useEditorStore(useShallow((state) => state.images));

export const useImage = (imageId: string) =>
  useEditorStore((state) => state.images[imageId]);

export const useHasImage = (imageId: string) =>
  useEditorStore((state) => imageId in state.images);

// Actions
export const useSetImages = () => useEditorStore((state) => state.setImages);

export const useAddImage = () => useEditorStore((state) => state.addImage);

export const useRemoveImage = () =>
  useEditorStore((state) => state.removeImage);

export const useClearImages = () =>
  useEditorStore((state) => state.clearImages);
