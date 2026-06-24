import { PointerEvent, RefObject } from "react";
import { Point, PointTuple } from "../types/types";
import { renderPreviewShape } from "../shapes/render-preview-shape";
import { createShape } from "../shapes/create-shape";
import { getScreenToCanvasCoordinates } from "../utils/get-coordinates";
import { updateDrawingPoints } from "../shapes/update-shape";
import * as store from "../store/selectors";

type UseDrawingArgs = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  ctxRef: { current: CanvasRenderingContext2D | null };
  pointerStateRefs: {
    startPointRef: RefObject<Point | null>;
    drawingPointsRef: RefObject<PointTuple[]>;
    lastPointerRef: RefObject<Point | null>;
  };
};

export default function useDrawing({
  canvasRef,
  ctxRef,
  pointerStateRefs,
}: UseDrawingArgs) {
  const { startPointRef, drawingPointsRef, lastPointerRef } = pointerStateRefs;

  const shapes = store.useShapes();
  const setShapes = store.useSetShapes();
  const selectedTool = store.useSelectedTool();
  const panOffset = store.usePanOffset();
  const scale = store.useScale();
  const scaleOffset = store.useScaleOffset();

  // Get Canvas Point
  function getCanvasPointFromEvent(e: PointerEvent<HTMLCanvasElement>) {
    return getScreenToCanvasCoordinates({
      screenX: e.clientX,
      screenY: e.clientY,
      canvas: e.currentTarget,
      panOffset,
      scale,
      scaleOffset,
    });
  }

  // Sets Initial Point on Pointer Down - for Shapes With Points
  function onPointerDownDrawing(e: PointerEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return;

    canvasRef.current.setPointerCapture(e.pointerId);
    const point = getCanvasPointFromEvent(e);

    startPointRef.current = point;
    lastPointerRef.current = point;
    drawingPointsRef.current = [[0, 0]];
  }

  // Handles Drawing During Mouse Move
  function onPointerMoveDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const start = startPointRef.current;
    if (!start) return;
    const end = getCanvasPointFromEvent(e);

    const relativePoint: PointTuple = [end.x - start.x, end.y - start.y];

    drawingPointsRef.current = updateDrawingPoints({
      tool: selectedTool,
      relativePoint,
      currentPoints: drawingPointsRef.current,
    });

    renderPreviewShape({
      ctx,
      tool: selectedTool,
      startPoint: start,
      endPoint: end,
      points: drawingPointsRef.current,
      shapes,
      scale,
      panOffset,
      scaleOffset,
    });

    lastPointerRef.current = end;
  }

  // Saves the Shapes
  function onPointerUpDrawing(e: PointerEvent<HTMLCanvasElement>) {
    const start = startPointRef.current;
    if (!start) return;
    const end = getCanvasPointFromEvent(e);

    const shape = createShape({
      tool: selectedTool,
      startPoint: start,
      endPoint: end,
      points: drawingPointsRef.current,
    });

    if (shape) setShapes((prev) => [...prev, shape]);

    // reset
    startPointRef.current = null;
    drawingPointsRef.current = [];
  }

  return { onPointerDownDrawing, onPointerMoveDrawing, onPointerUpDrawing };
}
