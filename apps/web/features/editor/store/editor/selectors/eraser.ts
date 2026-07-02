import { useEditorStore } from "../editor-store";

export const useEraserPoints = () =>
  useEditorStore((state) => state.eraserPoints);

export const useSetEraserPoints = () =>
  useEditorStore((state) => state.setEraserPoints);
