import { useCanvasRenderer } from "../../context/use-renderer";
import { useEditorStore } from "../../store/editor/editor-store";
import {
  useSetSelectedShapesIds,
  useSetShapes,
} from "../../store/editor/selectors";

export default function useDeleteShapes() {
  const setShapes = useSetShapes();
  const setSelectedShapesIds = useSetSelectedShapesIds();
  const { invalidate } = useCanvasRenderer();

  const deleteShapes = () => {
    const { selectedShapesIds } = useEditorStore.getState();
    const selected = new Set(selectedShapesIds);

    if (selectedShapesIds.length === 0) return;

    setShapes((prevShapes) =>
      prevShapes.filter((shape) => !selected.has(shape.id)),
    );
    setSelectedShapesIds([]);
    
    invalidate();
  };

  return { deleteShapes };
}
