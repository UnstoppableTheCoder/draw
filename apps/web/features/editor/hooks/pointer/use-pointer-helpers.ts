import { PointerEvent, RefObject } from "react";
import { usePointerState } from "./use-pointer-state";
import * as store from "../../store/selectors";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import useCanvasCursor from "../canvas/use-canvas-cursor";

export default function usePointer(
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const panOffset = store.usePanOffset();

  const { clientToCanvas } = useViewportHelpers(overlayCanvasRef);
  const canvasCursor = useCanvasCursor({ overlayCanvasRef, pointerRefs });

  // Sets the required initial states
  function initializePointerState(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    canvas.setPointerCapture(event.pointerId);
    pointerRefs.isPointerDownRef.current = true;

    const point = clientToCanvas(event.clientX, event.clientY);

    pointerRefs.drawingStartRef.current = point;
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
    canvasCursor.updateCursor();
    return true;
  }

  // Get Canvas Point
  function getCurrentCanvasPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    return clientToCanvas(e.clientX, e.clientY);
  }

  // Resets the required pointer states - pointerUp
  function resetPointerState() {
    pointerRefs.isPanningRef.current = false;
    pointerRefs.isPointerDownRef.current = false;
  }

  return {
    initializePointerState,
    handleMiddleMousePan,
    getCurrentCanvasPoint,
    resetPointerState,
    initializePanState,
  };
}
