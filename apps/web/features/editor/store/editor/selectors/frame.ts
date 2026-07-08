import { useEditorStore } from "../editor-store";
export const useHoveredFrameId = () =>
  useEditorStore((state) => state.hoveredFrameId);

export const useSetHoveredFrameId = () =>
  useEditorStore((state) => state.setHoveredFrameId);
