import { RefObject } from "react";
import { getPointInShape } from "../../geometry/hit-test";
import * as store from "../../store/selectors";
import { EraserPoint, Point } from "../../types/types";
import { clearCanvas } from "../../draw/clear-canvas";
import { ERASER_TOLERANCE } from "../../constants/eraser";
import { usePointerState } from "../pointer/use-pointer-state";
import drawEraserBackground from "../../draw/draw-eraser-background";

export default function useCanvasEraser(
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const shapes = store.useShapes();
  const setShapes = store.useSetShapes();
  const panOffset = store.usePanOffset();
  const scale = store.useScale();
  const scaleOffset = store.useScaleOffset();

  const eraserPointsRef = pointerRefs.eraserPointsRef;

  const ctx = overlayCanvasRef.current?.getContext("2d");

  function addEraserPoints(point: Point) {
    const now = performance.now();
    const trail = eraserPointsRef.current;

    trail.push({ ...point, time: now });

    while (trail.length && now - trail[0]!.time > 100) {
      trail.shift();
    }

    return trail;
  }

  function animateEraserBackground(eraserPoints: EraserPoint[]) {
    drawEraserBackground({
      overlayCanvasRef,
      eraserPoints,
      panOffset,
      scale,
      scaleOffset,
    });
  }

  function deleteShapes(point: Point) {
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

  function onPointerMoveErase(point: Point) {
    if (!ctx) return;
    // clearCanvas(ctx);

    const trail = addEraserPoints(point);
    animateEraserBackground(trail);
    deleteShapes(point);
  }

  function resetEraserBackground() {
    if (!ctx) return;

    eraserPointsRef.current = [];
    clearCanvas(ctx);
  }

  return {
    onPointerMoveErase,
    resetEraserBackground,
  };
}
