import { PointerEvent, RefObject } from "react";
import { usePointerState } from "./use-pointer-state";
import * as store from "../../store/selectors";
import useViewportHelpers from "../viewport/use-viewport";

export default function usePointer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const panOffset = store.usePanOffset();
  const scale = store.useScale();
  const scaleOffset = store.useScaleOffset();

  const viewportHelpers = useViewportHelpers({
    canvasRef,
    panOffset,
    scale,
    scaleOffset,
  });

  // Sets the required initial states
  function initializePointerState(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    canvas.setPointerCapture(event.pointerId);
    pointerRefs.isPointerDownRef.current = true;

    const point = viewportHelpers.getScreenToCanvasCoordinates(
      event.clientX,
      event.clientY,
    );

    pointerRefs.startPointRef.current = point;
    pointerRefs.lastPointerRef.current = point;
    return point;
  }

  // Sets the required pan states
  function initializePanState(event: PointerEvent<HTMLCanvasElement>) {
    pointerRefs.isPanningRef.current = true;
    pointerRefs.panStartMouseRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    pointerRefs.panStartOffsetRef.current = { ...panOffset };
  }

  // Sets the required initial states for Middle Mouse Pan
  function handleMiddleMousePan(event: PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 1) return false;

    initializePanState(event);
    return true;
  }

  // Get Canvas Point
  function getCurrentCanvasPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    return viewportHelpers.getScreenToCanvasCoordinates(e.clientX, e.clientY);
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

  // Resets the required pointer states - pointerUp
  function resetPointerState() {
    pointerRefs.isPanningRef.current = false;
    pointerRefs.isPointerDownRef.current = false;
    pointerRefs.resizableHandleRef.current = null;
    pointerRefs.resizeStartBoundsRef.current = null;
    pointerRefs.resizeStartFontSizeRef.current = null;
    pointerRefs.lineResizeStateRef.current = null;
  }

  return {
    initializePointerState,
    handleMiddleMousePan,
    getCurrentCanvasPoint,
    getPointerDelta,
    resetPointerState,
    initializePanState,
  };
}
