import { PointerEvent, RefObject } from "react";
import { createShape } from "../../shapes/create-shape";
import { updateDrawingPoints } from "../../shapes/update-shape";
import * as store from "../../store/selectors";
import useViewportHelpers from "../viewport/use-viewport";
import useCanvasRenderer from "../canvas/use-canvas-renderer";
import { usePointerState } from "../pointer/use-pointer-state";

type UseDrawingArgs = {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
};

export default function useShapeDrawing({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
}: UseDrawingArgs) {
  const { startPointRef, drawingPointsRef } = pointerRefs;

  const setShapes = store.useSetShapes();
  const selectedTool = store.useSelectedTool();
  const pushHistory = store.usePushHistory();

  const viewportHelpers = useViewportHelpers({
    canvasRef: overlayCanvasRef,
  });

  const renderer = useCanvasRenderer(pointerRefs);

  // Get Canvas Point
  function getCanvasPointFromEvent(e: PointerEvent<HTMLCanvasElement>) {
    return viewportHelpers.getScreenToCanvasCoordinates(e.clientX, e.clientY);
  }

  // Sets Initial Point on Pointer Down - for Shapes With Points
  function onPointerDownDrawing(e: PointerEvent<HTMLCanvasElement>) {
    if (!overlayCanvasRef.current) return;

    overlayCanvasRef.current.setPointerCapture(e.pointerId);
    const point = getCanvasPointFromEvent(e);

    startPointRef.current = point;
    lastPointerRef.current = point;
    drawingPointsRef.current = [[0, 0]];
  }

  // Handles Drawing During Mouse Move
  function onPointerMoveDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    const start = startPointRef.current;
    if (!start) return;

    const end = getCanvasPointFromEvent(e);
    if (!end) return;

    const relativePoint: PointTuple = [end.x - start.x, end.y - start.y];

    drawingPointsRef.current = updateDrawingPoints({
      tool: selectedTool,
      relativePoint,
      currentPoints: drawingPointsRef.current,
    });

    renderer?.renderOverlay();

    // renderPreviewShape({
    //   overlayCanvasRef,
    //   tool: selectedTool,
    //   startPoint: start,
    //   endPoint: end,
    //   points: drawingPointsRef.current,
    //   shapes,
    //   scale,
    //   panOffset,
    //   scaleOffset,
    // });

    lastPointerRef.current = end;
  }

  // Saves the Shapes
  function onPointerUpDrawing(e: PointerEvent<HTMLCanvasElement>) {
    const start = startPointRef.current;
    if (!start) return;

    const end = getCanvasPointFromEvent(e);
    if (!end) return;

    // Selected Tool decides if the shape is going to be created or not
    const shape = createShape({
      tool: selectedTool,
      startPoint: start,
      endPoint: end,
      points: drawingPointsRef.current,
    });

    pushHistory();
    if (shape) setShapes((prev) => [...prev, shape]);

    // reset
    startPointRef.current = null;
    drawingPointsRef.current = [];
  }

  return { onPointerDownDrawing, onPointerMoveDrawing, onPointerUpDrawing };
}
