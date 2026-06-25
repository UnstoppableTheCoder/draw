import { PointerEvent, RefObject } from "react";
import useCanvasContext from "./use-canvas-context";
import useDrawing from "./use-drawing";
import useSelectionInteraction from "./use-selection-interaction";
import usePan from "./use-pan";
import * as store from "../store/selectors";
import { usePointerState } from "./use-pointer-state";
import useCanvasEraser from "./use-canvas-eraser";
import useCanvasRenderer from "./use-canvas-renderer";
import usePointerHelpers from "./use-pointer-helpers";

export default function useCanvasInteractions(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const scale = store.useScale();
  const panOffset = store.usePanOffset();
  const selectedTool = store.useSelectedTool();
  const setTextEditingState = store.useSetTextEditingState();
  const setSelectedTool = store.useSetSelectedTool();
  const selectedShape = store.useSelectedShape();
  const isLocked = store.useIsLocked();

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
  const eraser = useCanvasEraser(ctxRef, canvasRef);
  useCanvasRenderer(ctxRef);

  const pointerHelpers = usePointerHelpers(canvasRef, pointerRefs);

  // ============== DOM Pointer Events Handlers ==============
  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    event.preventDefault();

    // clear selection if needed
    pointerHelpers.clearSelection();

    // Sets the required initial states for Middle Mouse Pan
    if (pointerHelpers.handleMiddleMousePan(event)) return;

    // Sets the required initial states
    const startPoint = pointerHelpers.initializePointerState(event);

    // Route based on tool
    if (selectedTool === "pan") {
      pointerRefs.panStartMouseRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      pointerRefs.panStartOffsetRef.current = { ...panOffset };
      pointerRefs.isPanningRef.current = true;
      pointerHelpers.updateCanvasCursor(
        selectedTool,
        pointerRefs.isPanningRef.current,
      );
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
    const isPointerDown = pointerRefs.isPointerDownRef.current;
    const isPanning = pointerRefs.isPanningRef.current;

    pointerHelpers.updateCanvasCursor(selectedTool, isPanning);

    if (selectedTool === "text") {
      return;
    }

    if ((selectedTool === "pan" && isPointerDown) || isPanning) {
      handlePanMove(event.clientX, event.clientY);
      return;
    }

    const endPoint = pointerHelpers.getCurrentCanvasPoint(event);

    // update last pointer for delta calculations
    const delta = pointerHelpers.getPointerDelta(endPoint);
    if (!delta) return;

    if (selectedTool === "select") {
      const handled = selection.onPointerMoveSelection(
        endPoint,
        delta.dx,
        delta.dy,
      );

      if (handled) return;
    }

    if (selectedTool === "eraser" && isPointerDown) {
      eraser.onPointerMoveErase(endPoint);
      return;
    }

    // default -> drawing preview
    drawing.onPointerMoveDrawing(event);
  }

  function handlePointerUp(event: PointerEvent<HTMLCanvasElement>) {
    const isResizing = pointerRefs.isResizingRef.current;
    pointerHelpers.updateCanvasCursor(
      selectedTool,
      pointerRefs.isPanningRef.current,
    );

    pointerHelpers.resetPointerState();

    if (selectedShape && selectedShape.type === "text") {
      const isDragging = pointerRefs.isDraggingRef.current;
      const pointerDownTime = pointerRefs.pointerDownTimeRef.current;
      if (!pointerDownTime) return;
      const duration = performance.now() - pointerDownTime;

      if (duration <= 250 && !isDragging) {
        // Start Editing
        setTextEditingState({
          id: selectedShape.id,
          x: selectedShape.x,
          y: selectedShape.y,
          text: selectedShape.text,
        });

        // Clear Selection if shape is being edited
        pointerHelpers.clearSelection();
      }

      pointerRefs.pointerDownTimeRef.current = null;
    }

    pointerRefs.isDraggingRef.current = false;

    // finish resize if any
    if (isResizing) {
      pointerRefs.isResizingRef.current = false;
      return;
    }

    if (selectedTool === "eraser") {
      eraser.resetEraserBackground();
    }

    // reset tool for certain tools
    if (
      selectedTool !== "pan" &&
      selectedTool !== "freedraw" &&
      selectedTool !== "eraser" &&
      !isLocked
    ) {
      setSelectedTool("select");
    }

    // Saves the Shapes
    drawing.onPointerUpDrawing(event);
  }

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}
