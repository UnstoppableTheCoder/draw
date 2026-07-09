import { useCanvasRenderer } from "../../context/use-renderer";
import { useEditorStore } from "../../store/editor/editor-store";
import {
  useFrameEditingState,
  useSetSelectedShapesIds,
  useSetShapes,
} from "../../store/editor/selectors";
import { usePointerState } from "../pointer/use-pointer-state";

export default function useDeleteShapes(
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const setShapes = useSetShapes();
  const setSelectedShapesIds = useSetSelectedShapesIds();
  // const frameEditingState = useFrameEditingState();
  const { invalidate } = useCanvasRenderer();

  const deleteShapes = () => {
    const { selectedShapesIds } = useEditorStore.getState();
    const selected = new Set(selectedShapesIds);
    const { frameEditingState } = useEditorStore.getState();

    if (selectedShapesIds.length === 0) return;
    if (frameEditingState) return;

    setShapes((prevShapes) =>
      prevShapes.filter((shape) => !selected.has(shape.id)),
    );
    setSelectedShapesIds([]);

    pointerRefs.interactionRef.current = {
      type: "none",
    };

    invalidate();
  };

  return { deleteShapes };
}
