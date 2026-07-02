import { useSetShapes, useShapes } from "../../store/editor/selectors";
import { Shape } from "../../types/types";

export default function useShapeOrder() {
  const shapes = useShapes();
  const setShapes = useSetShapes();

  function swap<T>(array: T[], i: number, j: number) {
    [array[i], array[j]] = [array[j]!, array[i]!];
  }

  function bringForward(shapes: Shape[], selectedIds: string[]) {
    const newShapes = [...shapes];
    const selected = new Set(selectedIds);

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
  }

  function sendBackward(selectedIds: string[]) {
    const newShapes = [...shapes];
    const selected = new Set(selectedIds);

    for (let i = 1; i < newShapes.length; i++) {
      const current = newShapes[i];
      const previous = newShapes[i - 1];
      if (!current || !previous) continue;

      if (selected.has(current.id) && !selected.has(previous.id)) {
        swap(newShapes, i, i - 1);
      }
    }

    setShapes(newShapes);
  }

  function bringToFront(shapes: Shape[], selectedIds: string[]) {
    const selected = new Set(selectedIds);

    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
    const otherShapes = shapes.filter((shape) => !selected.has(shape.id));

    setShapes([...otherShapes, ...selectedShapes]);
  }

  function sendToBack(shapes: Shape[], selectedIds: string[]) {
    const selected = new Set(selectedIds);

    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
    const otherShapes = shapes.filter((shape) => !selected.has(shape.id));

    setShapes([...selectedShapes, ...otherShapes]);
  }

  return {
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  };
}
