import { PointerEvent, RefObject } from "react";
import useCanvasContext from "./use-canvas-context";
import useSelectionActions from "../shapes/use-selection-actions";
import * as store from "../../store/selectors";
import { usePointerState } from "../pointer/use-pointer-state";
import useCanvasRenderer from "./use-canvas-renderer";
import useCanvasCursor from "./use-canvas-cursor";
import { Point } from "../../types/types";
import usePan from "../tool/use-pan";
import useShapeDrawing from "../tool/use-shape-drawing";
import usePointer from "../pointer/use-pointer";
import useCanvasEraser from "../tool/use-canvas-eraser";
import useTextEditing from "../text/use-text-editing";
import { v4 as uuidv4 } from "uuid";

export default function useCanvasInteractions(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const scale = store.useScale();
  const selectedTool = store.useSelectedTool();
  const setTextEditingState = store.useSetTextEditingState();
  const setSelectedTool = store.useSetSelectedTool();
  const selectedShape = store.useSelectedShape();
  const isLocked = store.useIsLocked();
  const fontSize = store.useFontSize();
  const fontFamily = store.useFontFamily();

  const { ctxRef } = useCanvasContext(canvasRef);
  const drawing = useShapeDrawing({
    canvasRef,
    ctxRef,
    pointerStateRefs: {
      startPointRef: pointerRefs.startPointRef,
      drawingPointsRef: pointerRefs.drawingPointsRef,
      lastPointerRef: pointerRefs.lastPointerRef,
    },
  });
  const selection = useSelectionActions(canvasRef, scale, pointerRefs);
  const { handlePanMove } = usePan(
    pointerRefs.panStartMouseRef,
    pointerRefs.panStartOffsetRef,
  );
  const eraser = useCanvasEraser(ctxRef);
  useCanvasRenderer(ctxRef);
  const pointerHelpers = usePointer(canvasRef, pointerRefs);
  const canvasCursor = useCanvasCursor({
    canvasRef,
    selectedTool,
    isPanningRef: pointerRefs.isPanningRef,
  });

  function startEditingText(point: Point) {
    setTextEditingState({
      type: "text",
      x: point.x,
      y: point.y,
      text: "",
      fontSize,
      fontFamily,
    });
  }

  function routePointerDown(
    event: PointerEvent<HTMLCanvasElement>,
    startPoint: Point,
  ) {
    switch (selectedTool) {
      case "pan":
        pointerHelpers.initializePanState(event);
        canvasCursor.updateCursor();
        break;

      case "select":
        // Handles Select and Resize on Pointer Down
        selection.onPointerDownSelection(startPoint);
        break;

      case "text":
        startEditingText(startPoint);
        break;

      default:
        // Set States for drawing tools with points
        drawing.onPointerDownDrawing(event);
    }
  }

  function routePointerMove(
    event: React.PointerEvent<HTMLCanvasElement>,
    endPoint: Point,
    delta: { dx: number; dy: number },
  ) {
    const isPointerDown = pointerRefs.isPointerDownRef.current;

    switch (selectedTool) {
      case "text":
        return;

      case "pan":
        if (isPointerDown) {
          handlePanMove(event.clientX, event.clientY);
        }
        return;

      case "select": {
        const handled = selection.onPointerMoveSelection(
          endPoint,
          delta.dx,
          delta.dy,
        );

        if (!handled) {
          drawing.onPointerMoveDrawing(event);
        }
        return;
      }

      case "eraser":
        if (isPointerDown) {
          eraser.onPointerMoveErase(endPoint);
        }
        return;

      default:
        // rectangle, ellipse, diamond, arrow, line, freedraw, image
        drawing.onPointerMoveDrawing(event);
        return;
    }
  }

  function handleTextEditingOnPointerUp() {
    if (selectedShape && selectedShape.type === "text") {
      const isDragging = pointerRefs.isDraggingRef.current;
      const pointerDownTime = pointerRefs.pointerDownTimeRef.current;
      if (!pointerDownTime) return;
      const duration = performance.now() - pointerDownTime;

      if (duration <= 250 && !isDragging) {
        // Start Editing
        setTextEditingState({ ...selectedShape });

        // Clear Selection if shape is being edited
        selection.clearSelection();
      }

      pointerRefs.pointerDownTimeRef.current = null;
    }
  }

  function handleResizeEnd() {
    const isResizing = pointerRefs.isResizingRef.current;
    if (isResizing) {
      pointerRefs.isResizingRef.current = false;
      return;
    }
  }

  function handleEraseEnd() {
    if (selectedTool === "eraser") {
      eraser.resetEraserBackground();
    }
  }

  function handleToolReset() {
    if (
      selectedTool !== "pan" &&
      selectedTool !== "freedraw" &&
      selectedTool !== "eraser" &&
      !isLocked
    ) {
      setSelectedTool("select");
    }
  }

  function handleDrawingEnd(event: PointerEvent<HTMLCanvasElement>) {
    drawing.onPointerUpDrawing(event);
  }

  // ============== DOM Pointer Events Handlers ==============
  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    event.preventDefault();

    // clear selection if needed
    selection.clearSelection();

    // Sets the required initial states for Middle Mouse Pan
    if (pointerHelpers.handleMiddleMousePan(event)) {
      canvasCursor.updateCursor();
      return;
    }

    // Sets the required initial states
    const startPoint = pointerHelpers.initializePointerState(event);
    if (!startPoint) return;

    // Route based on tool
    routePointerDown(event, startPoint);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    canvasCursor.updateCursor();

    // Middle mouse pan can happen regardless of selected tool
    if (pointerRefs.isPanningRef.current) {
      handlePanMove(event.clientX, event.clientY);
      return;
    }

    const endPoint = pointerHelpers.getCurrentCanvasPoint(event);
    if (!endPoint) return;

    const delta = pointerHelpers.getPointerDelta(endPoint);
    if (!delta) return;

    routePointerMove(event, endPoint, delta);
  }

  function handlePointerUp(event: PointerEvent<HTMLCanvasElement>) {
    pointerHelpers.resetPointerState();
    canvasCursor.updateCursor();

    handleTextEditingOnPointerUp();

    pointerRefs.isDraggingRef.current = false;

    handleResizeEnd();
    handleEraseEnd();
    handleToolReset();
    handleDrawingEnd(event);
  }

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}
