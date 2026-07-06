import { DUPLICATE_OFFSET } from "../../constants/actions";
import { useCanvasRenderer } from "../../context/use-renderer";
import { useEditorStore } from "../../store/editor/editor-store";
import {
  useSetSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { v4 as uuidv4 } from "uuid";

export default function useDuplicateShapes() {
  const shapes = useShapes();
  const setShapes = useSetShapes();
  const setSelectedShapesIds = useSetSelectedShapesIds();
  const { invalidate } = useCanvasRenderer();

  const duplicateShapes = () => {
    const { selectedShapesIds } = useEditorStore.getState();
    const selected = new Set(selectedShapesIds);

    if (selectedShapesIds.length === 0) return;

    const duplicatedShapes = shapes
      .filter((shape) => selected.has(shape.id))
      .map((shape) => ({
        ...shape,
        x: shape.x + DUPLICATE_OFFSET,
        y: shape.y + DUPLICATE_OFFSET,
        id: uuidv4(),
      }));

    setShapes((prev) => [...prev, ...duplicatedShapes]);
    setSelectedShapesIds(duplicatedShapes.map((shape) => shape.id));
    invalidate();
  };

  return { duplicateShapes };
}
