import { RefObject } from "react";
import { getPointInShape } from "../geometry/hit-test";
import * as store from "../store/selectors";
import { Point } from "../types/types";
import { clearCanvas } from "../draw/clear-canvas";

export default function useCanvasEraser(
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const shapes = store.useShapes();
  const setShapes = store.useSetShapes();
  const setEraserPoints = store.useSetEraserPoints();

  function deleteShape(hitShapeId: string) {
    setShapes((prevShapes) =>
      prevShapes.filter((shape) => shape.id !== hitShapeId),
    );
  }

  function onPointerMoveErase(point: Point) {
    // Todo: Fix hit testing for lines
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ERASER_TOLERANCE = 10;

    setEraserPoints((prevPoints) => [...prevPoints, [point.x, point.y]]);

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
