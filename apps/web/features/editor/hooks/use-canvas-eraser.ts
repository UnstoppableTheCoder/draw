import { RefObject } from "react";
import { getPointInShape } from "../geometry/hit-test";
import {
  useSetEraserPoints,
  useSetShapes,
  useShapes,
} from "../store/selectors";
import { Point } from "../types/types";
import { clearCanvas } from "../draw/clear-canvas";

export default function useCanvasEraser(
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
) {
  const shapes = useShapes();
  const setShapes = useSetShapes();

  const setEraserPoints = useSetEraserPoints();

  function deleteShape(hitShapeId: string) {
    setShapes((prevShapes) =>
      prevShapes.filter((shape) => shape.id !== hitShapeId),
    );
  }

  function onPointerMoveErase(point: Point) {
    // Todo: Fix hit testing for lines

    setEraserPoints((prevPoints) => [...prevPoints, [point.x, point.y]]);

    const ERASER_TOLERANCE = 10;

    for (const shape of shapes) {
      const hitShape = getPointInShape(point, shape, ERASER_TOLERANCE);

      if (hitShape && hitShape.id) {
        deleteShape(hitShape.id);
      }
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
