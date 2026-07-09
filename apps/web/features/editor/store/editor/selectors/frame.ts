import { useEditorStore } from "../editor-store";
export const useHoveredFrameId = () =>
  useEditorStore((state) => state.hoveredFrameId);

export const useSetHoveredFrameId = () =>
  useEditorStore((state) => state.setHoveredFrameId);

export const useFrameEditingState = () =>
  useEditorStore((state) => state.frameEditingState);

export const useSetFrameEditingState = () =>
  useEditorStore((state) => state.setFrameEditingState);
