import { useEditorStore } from "../editor-store";

export const useSelectedShapesIds = () =>
  useEditorStore((state) => state.selectedShapesIds);

export const useSetSelectedShapesIds = () =>
  useEditorStore((state) => state.setSelectedShapesIds);

export const useSelectionBounds = () =>
  useEditorStore((state) => state.selectionBounds);

export const useSetSelectionBounds = () =>
  useEditorStore((state) => state.setSelectionBounds);

export const useTextEditingState = () =>
  useEditorStore((state) => state.textEditingState);

export const useSetTextEditingState = () =>
  useEditorStore((state) => state.setTextEditingState);
