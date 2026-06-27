import { useEditorStore } from "../editor-store";

export const useSelectedShape = () =>
  useEditorStore((state) => state.selectedShape);

export const useSetSelectedShape = () =>
  useEditorStore((state) => state.setSelectedShape);

export const useSelectedShapeBounds = () =>
  useEditorStore((state) => state.selectedShapeBounds);

export const useSetSelectedShapeBounds = () =>
  useEditorStore((state) => state.setSelectedShapeBounds);

export const useTextEditingState = () =>
  useEditorStore((state) => state.textEditingState);

export const useSetTextEditingState = () =>
  useEditorStore((state) => state.setTextEditingState);
