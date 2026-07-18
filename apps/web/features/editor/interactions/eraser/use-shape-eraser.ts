import { RefObject } from "react";
import * as store from "../../store/editor/selectors";
import { ERASER_TOLERANCE } from "../../constants/eraser";
import { useCanvasRenderer } from "../../context/use-renderer";
import { getPointInShape } from "../../geometry/hit-test/get-point-in-shape";
import { usePointerState } from "../../pointer/use-pointer-state";
import { Point } from "../../types";
import { deleteShapes as deleteShapesApi } from "../../networking/api/shape-api";
import { useParams } from "next/navigation";
import { array } from "zod";

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
  const { pageId } = useParams<{ pageId: string }>();

  const shapes = store.useShapes();
  const setShapes = store.useSetShapes();
  const scale = store.useScale();

  const { invalidate } = useCanvasRenderer();

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

    return hitIds;
  }

  async function onPointerMoveErase(point: Point) {
    addTrailPoint(point);
    const deletedShapesIdsSet = deleteShapes(point);
    invalidate();

    try {
      await deleteShapesApi(pageId, Array.from(deletedShapesIdsSet));
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return {
    onPointerMoveErase,
  };
}
