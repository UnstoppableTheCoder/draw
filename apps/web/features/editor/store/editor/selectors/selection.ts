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

export const useSelectedGroupsIds = () =>
  useEditorStore((state) => state.selectedGroupsIds);

export const useSetSelectedGroupsIds = () =>
  useEditorStore((state) => state.setSelectedGroupsIds);

export const useFrames = () => useEditorStore((state) => state.frames);

export const useSetFrames = () => useEditorStore((state) => state.setFrames);
