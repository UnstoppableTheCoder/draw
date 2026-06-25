import { PointerEvent, RefObject } from "react";
import { usePointerState } from "./use-pointer-state";
import { getScreenToCanvasCoordinates } from "../utils/get-coordinates";
import * as store from "../store/selectors";
import { ToolType } from "@/types/toolbar.types";
import { getCanvasCursor } from "../utils/get-canvas-cursor";

export default function usePointerHelpers(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const panOffset = store.usePanOffset();
  const scale = store.useScale();
  const scaleOffset = store.useScaleOffset();
  const setSelectedShape = store.useSetSelectedShape();
  const setSelectedShapeBounds = store.useSetSelectedShapeBounds();

  // Sets the required initial states
  function initializePointerState(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    canvas.setPointerCapture(event.pointerId);
    pointerRefs.isPointerDownRef.current = true;

    const point = getScreenToCanvasCoordinates({
      screenX: event.clientX,
      screenY: event.clientY,
      canvas,
      panOffset,
      scale,
      scaleOffset,
    });

    pointerRefs.startPointRef.current = point;
    pointerRefs.lastPointerRef.current = point;
    return point;
  }

  // Sets the required initial states for Middle Mouse Pan
  function handleMiddleMousePan(event: PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 1) return false;

    pointerRefs.isPanningRef.current = true;
    pointerRefs.panStartMouseRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    pointerRefs.panStartOffsetRef.current = { ...panOffset };
    return true;
  }

  // Get Canvas Point
  function getCurrentCanvasPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    return getScreenToCanvasCoordinates({
      screenX: e.clientX,
      screenY: e.clientY,
      canvas: e.currentTarget,
      panOffset,
      scale,
      scaleOffset,
    });
  }

  // Get Delta & Update Last Point
  function getPointerDelta(endPoint: any) {
    const last = pointerRefs.lastPointerRef.current;
    if (!last) return null;

    const dx = endPoint.x - last.x;
    const dy = endPoint.y - last.y;

    pointerRefs.lastPointerRef.current = endPoint;
    return { dx, dy };
  }

  function resetPointerState() {
    pointerRefs.isPanningRef.current = false;
    pointerRefs.isPointerDownRef.current = false;
    pointerRefs.resizableHandleRef.current = null;
    pointerRefs.resizeStartBoundsRef.current = null;
    pointerRefs.resizeStartFontSizeRef.current = null;
    pointerRefs.lineResizeStateRef.current = null;
  }

  function updateCanvasCursor(tool: ToolType, isPanning: boolean) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = getCanvasCursor(tool, isPanning);
  }

  // Clear Selection
  function clearSelection() {
    setSelectedShape(null);
    setSelectedShapeBounds(null);
  }

  return {
    initializePointerState,
    handleMiddleMousePan,
    getCurrentCanvasPoint,
    getPointerDelta,
    resetPointerState,
    updateCanvasCursor,
    clearSelection,
  };
}
