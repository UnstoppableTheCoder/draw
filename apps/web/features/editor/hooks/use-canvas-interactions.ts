import { PointerEvent, RefObject } from "react";
import useCanvasContext from "./use-canvas-context";
import useDrawing from "./use-drawing";
import useSelectionInteraction from "./use-selection-interaction";
import usePan from "./use-pan";
import { getScreenToCanvasCoordinates } from "../utils/get-coordinates";
import * as store from "../store/selectors";
import { usePointerState } from "./use-pointer-state";
import { ToolType } from "@/types/toolbar.types";
import { getCanvasCursor } from "../utils/get-canvas-cursor";
import useCanvasEraser from "./use-canvas-eraser";

export default function useCanvasInteractions(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const pointerRefs = usePointerState();

  const scale = store.useScale();
  const panOffset = store.usePanOffset();
  const scaleOffset = store.useScaleOffset();
  const selectedTool = store.useSelectedTool();
  const setSelectedShape = store.useSetSelectedShape();
  const setSelectedShapeBounds = store.useSetSelectedShapeBounds();
  const setTextEditingState = store.useSetTextEditingState();
  const setSelectedTool = store.useSetSelectedTool();

  const { ctxRef } = useCanvasContext(canvasRef);
  const drawing = useDrawing({
    canvasRef,
    ctxRef,
    pointerStateRefs: {
      startPointRef: pointerRefs.startPointRef,
      drawingPointsRef: pointerRefs.drawingPointsRef,
      lastPointerRef: pointerRefs.lastPointerRef,
    },
  });
  const selection = useSelectionInteraction(canvasRef, scale, pointerRefs);
  const { handlePanMove } = usePan(
    pointerRefs.panStartMouseRef,
    pointerRefs.panStartOffsetRef,
  );
  const eraser = useCanvasEraser();

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

  // Clear Selection
  function clearSelection() {
    setSelectedShape(null);
    setSelectedShapeBounds(null);
  }

  function updateCanvasCursor(tool: ToolType, isPanning: boolean) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = getCanvasCursor(tool, isPanning);
  }

  // ============== DOM Pointer Events Handlers ==============
  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    event.preventDefault();

    // clear selection if needed
    clearSelection();

    // Sets the required initial states for Middle Mouse Pan
    if (handleMiddleMousePan(event)) return;

    // Sets the required initial states
    const startPoint = initializePointerState(event);

    // Route based on tool
    if (selectedTool === "pan") {
      pointerRefs.panStartMouseRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      pointerRefs.panStartOffsetRef.current = { ...panOffset };
      pointerRefs.isPanningRef.current = true;
      updateCanvasCursor(selectedTool, pointerRefs.isPanningRef.current);
      return;
    }

    if (selectedTool === "select") {
      // Handles Select and Resize on Pointer Down
      selection.onPointerDownSelection(startPoint);
      return;
    }

    if (selectedTool === "text") {
      setTextEditingState({ x: startPoint.x, y: startPoint.y, text: "" });
      return;
    }

    // Set States for drawing tools with points
    drawing.onPointerDownDrawing(event);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    updateCanvasCursor(selectedTool, pointerRefs.isPanningRef.current);

    if (
      (selectedTool === "pan" && pointerRefs.isPointerDownRef.current) ||
      pointerRefs.isPanningRef.current
    ) {
      handlePanMove(event.clientX, event.clientY);
      return;
    }

    const endPoint = getCurrentCanvasPoint(event);

    // update last pointer for delta calculations
    const delta = getPointerDelta(endPoint);
    if (!delta) return;

    if (selectedTool === "select") {
      const handled = selection.onPointerMoveSelection(
        endPoint,
        delta.dx,
        delta.dy,
      );

      if (handled) return;
    }

    if (selectedTool === "eraser") {
      eraser.onPointerMove(endPoint);
      return;
    }

    // default -> drawing preview
    drawing.onPointerMoveDrawing(event);
  }

  function handlePointerUp(event: PointerEvent<HTMLCanvasElement>) {
    pointerRefs.isPanningRef.current = false;
    pointerRefs.isPointerDownRef.current = false;
    pointerRefs.resizableHandleRef.current = null;
    pointerRefs.resizeStartBoundsRef.current = null;
    pointerRefs.resizeStartFontSizeRef.current = null;
    pointerRefs.lineResizeStateRef.current = null;

    updateCanvasCursor(selectedTool, pointerRefs.isPanningRef.current);

    // finish resize if any
    if (pointerRefs.isResizingRef.current) {
      pointerRefs.isResizingRef.current = false;
      return;
    }

    // reset tool for certain tools
    if (
      selectedTool !== "pan" &&
      selectedTool !== "freedraw" &&
      selectedTool !== "eraser"
    ) {
      setSelectedTool("select");
    }

    // Saves the Shapes
    drawing.onPointerUpDrawing(event);
  }

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}
