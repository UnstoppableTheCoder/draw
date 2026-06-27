import { useEditorStore } from "../editor-store";

export const useShapes = () => useEditorStore((state) => state.shapes);

export const useSetShapes = () => useEditorStore((state) => state.setShapes);
