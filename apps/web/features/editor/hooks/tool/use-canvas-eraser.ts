import { RefObject } from "react";
import { getPointInShape } from "../../geometry/hit-test";
import * as store from "../../store/selectors";
import { Point } from "../../types/types";
import { clearCanvas } from "../../draw/clear-canvas";
import { ERASER_TOLERANCE } from "../../constants/eraser";

export default function useCanvasEraser(
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
) {
  const shapes = store.useShapes();
  const setShapes = store.useSetShapes();
  const setEraserPoints = store.useSetEraserPoints();

  function onPointerMoveErase(point: Point) {
    setEraserPoints((prev) => [...prev, [point.x, point.y]]);

    const hitIds = new Set<string>();

    for (const shape of shapes) {
      const hit = getPointInShape(point, shape, ERASER_TOLERANCE);

      if (hit?.id) {
        hitIds.add(hit.id);
      }
    }

    if (hitIds.size > 0) {
      setShapes((prev) => prev.filter((shape) => !hitIds.has(shape.id)));
    }
  }

  function resetEraserBackground() {
    const ctx = ctxRef.current;
    if (!ctx) return;

    setEraserPoints([]);
    clearCanvas(ctx);
  }

  return {
    onPointerMoveErase,
    resetEraserBackground,
  };
}
