import { useEditorStore } from "../editor-store";

export const useIsInsideFrame = () =>
  useEditorStore((state) => state.isInsideFrame);

export const useSetIsInsideFrame = () =>
  useEditorStore((state) => state.setIsInsideFrame);

export const useParentFrameId = () =>
  useEditorStore((state) => state.parentFrameId);

export const useSetParentFrameId = () =>
  useEditorStore((state) => state.setParentFrameId);
