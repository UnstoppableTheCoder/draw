import { RefObject } from "react";
import * as store from "../../store/editor/selectors";
import { ERASER_TOLERANCE } from "../../constants/eraser";
import { Point } from "@/types/canvas";
import { useCanvasRenderer } from "../../context/use-renderer";
import { getPointInShape } from "../../geometry/hit-test/get-point-in-shape";
import { usePointerState } from "../../pointer/use-pointer-state";

const ERASER_TRAIL_DURATION = 100;
export default function useShapeEraser({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
}) {
  const shapes = store.useShapes();
  const setShapes = store.useSetShapes();
  const scale = store.useScale();

  const { invalidate, invalidateOverlay, invalidateScene } =
    useCanvasRenderer();

  const eraserTrailRef = pointerRefs.eraserTrailRef;

  function addTrailPoint(point: Point) {
    const now = performance.now();
    const trail = eraserTrailRef.current;

    trail.push({ ...point, time: now });

    while (trail.length && now - trail[0]!.time > ERASER_TRAIL_DURATION) {
      trail.shift();
    }

    return trail;
  }

  function deleteShapes(point: Point) {
    const hitIds = new Set<string>();

    for (const shape of shapes) {
      const hit = getPointInShape(point, shape, scale, ERASER_TOLERANCE);

      if (hit?.id) {
        hitIds.add(hit.id);
      }
    }

    if (hitIds.size > 0) {
      setShapes((prev) => prev.filter((shape) => !hitIds.has(shape.id)));
    }
  }

  function onPointerMoveErase(point: Point) {
    addTrailPoint(point);
    deleteShapes(point);

    invalidate();
  }

  return {
    onPointerMoveErase,
  };
}
