import { useCanvasRenderer } from "../../context/use-renderer";
import {
  useSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";

export default function useShapeOrder() {
  const shapes = useShapes();
  const setShapes = useSetShapes();
  const selectedShapeIds = useSelectedShapesIds();
  const { invalidate } = useCanvasRenderer();

  function swap<T>(array: T[], i: number, j: number) {
    [array[i], array[j]] = [array[j]!, array[i]!];
  }

  function bringForward() {
    const newShapes = [...shapes];
    const selected = new Set(selectedShapeIds);

    // Traverse backwards so a shape never moves twice
    for (let i = newShapes.length - 2; i >= 0; i--) {
      const current = newShapes[i];
      const next = newShapes[i + 1];
      if (!current || !next) continue;

      if (selected.has(current.id) && !selected.has(next.id)) {
        swap(newShapes, i, i + 1);
      }
    }

    setShapes(newShapes);
    invalidate();
  }

  function sendBackward() {
    const newShapes = [...shapes];
    const selected = new Set(selectedShapeIds);

    for (let i = 1; i < newShapes.length; i++) {
      const current = newShapes[i];
      const previous = newShapes[i - 1];
      if (!current || !previous) continue;

      if (selected.has(current.id) && !selected.has(previous.id)) {
        swap(newShapes, i, i - 1);
      }
    }

    setShapes(newShapes);
    invalidate();
  }

  function bringToFront() {
    const selected = new Set(selectedShapeIds);

    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
    const otherShapes = shapes.filter((shape) => !selected.has(shape.id));

    setShapes([...otherShapes, ...selectedShapes]);
    invalidate();
  }

  function sendToBack() {
    const selected = new Set(selectedShapeIds);

    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
    const otherShapes = shapes.filter((shape) => !selected.has(shape.id));

    setShapes([...selectedShapes, ...otherShapes]);
    invalidate();
  }

  return {
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  };
}
