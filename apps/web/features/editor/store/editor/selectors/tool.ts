import { useEditorStore } from "../editor-store";

export const useSelectedTool = () =>
  useEditorStore((state) => state.selectedTool);

export const useSetSelectedTool = () =>
  useEditorStore((state) => state.setSelectedTool);

export const useIsLocked = () => useEditorStore((state) => state.isLocked);

export const useSetIsLocked = () =>
  useEditorStore((state) => state.setIsLocked);
