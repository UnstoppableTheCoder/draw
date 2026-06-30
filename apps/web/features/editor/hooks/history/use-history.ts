import { useCallback } from "react";
import { useCanvasRenderer } from "../../renderer/use-renderer";
import {
  useCanRedo,
  useCanUndo,
  useRedo,
  useUndo,
} from "../../store/selectors";

export default function useHistory() {
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const undoStore = useUndo();
  const redoStore = useRedo();

  const { invalidate } = useCanvasRenderer();

  const undo = useCallback(() => {
    undoStore();
    invalidate();
  }, [undoStore, invalidate]);

  const redo = useCallback(() => {
    redoStore();
    invalidate();
  }, [redoStore, invalidate]);

  return { canUndo, canRedo, undo, redo };
}
