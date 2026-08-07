import { useCanvasRenderer } from "../../context/use-renderer";
import {
  useSetSelectedShapesIds,
  useShapes,
} from "../../store/editor/selectors";

export default function useSelectAllShapes() {
  const shapes = useShapes();
  const setSelectedShapesIds = useSetSelectedShapesIds();

  const { invalidate } = useCanvasRenderer();

  const selectAllShapes = () => {
    const selectedIds = shapes.map((shape) => shape.id);

    setSelectedShapesIds(selectedIds);
    invalidate();
  };

  return { selectAllShapes };
}

// if ((e.ctrlKey || e.metaKey) && e.key === "a") {
//   e.preventDefault();
//   selectAllShapes();
// }
