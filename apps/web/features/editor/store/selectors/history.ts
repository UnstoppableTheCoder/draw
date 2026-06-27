import { useEditorStore } from "../editor-store";

export const useUndoStack = () => useEditorStore((state) => state.undoStack);
export const useRedoStack = () => useEditorStore((state) => state.redoStack);
export const useUndo = () => useEditorStore((state) => state.undo);
export const useRedo = () => useEditorStore((state) => state.redo);
export const usePushHistory = () =>
  useEditorStore((state) => state.pushHistory);

export const useCanUndo = () =>
  useEditorStore((state) => state.undoStack.length > 0);

export const useCanRedo = () =>
  useEditorStore((state) => state.redoStack.length > 0);
