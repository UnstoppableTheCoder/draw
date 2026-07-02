import { useEditorStore } from "../editor-store";

export const useSelectedShapeIds = () =>
  useEditorStore((state) => state.selectedShapeIds);

export const useSetSelectedShapeIds = () =>
  useEditorStore((state) => state.setSelectedShapeIds);

export const useSelectionBounds = () =>
  useEditorStore((state) => state.selectionBounds);

export const useSetSelectionBounds = () =>
  useEditorStore((state) => state.setSelectionBounds);

export const useTextEditingState = () =>
  useEditorStore((state) => state.textEditingState);

export const useSetTextEditingState = () =>
  useEditorStore((state) => state.setTextEditingState);
