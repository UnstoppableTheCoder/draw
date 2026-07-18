import { useCanvasRenderer } from "../../context/use-renderer";
import { usePointerState } from "../../pointer/use-pointer-state";
import { useEditorStore } from "../../store/editor/editor-store";
import {
  useFrameEditingState,
  useSetSelectedShapesIds,
  useSetShapes,
} from "../../store/editor/selectors";
import { deleteShapes as deleteShapesApi } from "../../networking/api/shape-api";
import { useParams } from "next/navigation";

export default function useDeleteShapes(
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const { pageId } = useParams<{ pageId: string }>();

  const setShapes = useSetShapes();
  const setSelectedShapesIds = useSetSelectedShapesIds();
  // const frameEditingState = useFrameEditingState();
  const { invalidate } = useCanvasRenderer();

  const deleteShapes = async () => {
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

    try {
      await deleteShapesApi(pageId, selectedShapesIds);
    } catch (error) {
      console.log("Error deleting the shape: ", error);
    }
  };

  return { deleteShapes };
}
