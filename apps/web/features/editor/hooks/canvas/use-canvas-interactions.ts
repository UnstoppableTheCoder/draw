import { PointerEvent, RefObject } from "react";
import * as store from "../../store/selectors";
import { usePointerState } from "../pointer/use-pointer-state";
import useCanvasCursor from "./use-canvas-cursor";
import { Point } from "../../types/types";
import usePan from "../viewport/use-viewport-pan";
import usePointer from "../pointer/use-pointer-helpers";
import useShapeResize from "../drawing/use-shape-resize";
import useShapeDrawing from "../drawing/use-shape-drawing";
import useSelectionActions from "../drawing/use-shape-selection";
import useShapeMove from "../drawing/use-shape-move";
import useTextEditing from "../text/use-text-editing";
import useShapeEraser from "../drawing/use-shape-eraser";
import { useCanvasRenderer } from "../../renderer/use-renderer";

const STICKY_TOOLS = new Set(["pan", "freedraw", "eraser"]);

export default function useCanvasInteractions({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
  textareaRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const selectedShape = store.useSelectedShape();
  const setSelectedShape = store.useSetSelectedShape();
  const selectedTool = store.useSelectedTool();
  const setTextEditingState = store.useSetTextEditingState();
  const setSelectedTool = store.useSetSelectedTool();
  const isLocked = store.useIsLocked();

  const drawing = useShapeDrawing({
    sceneCanvasRef,
    overlayCanvasRef,
    pointerRefs,
  });
  const selection = useSelectionActions({
    sceneCanvasRef,
    overlayCanvasRef,
    pointerRefs,
  });
  const { handlePanMove } = usePan(pointerRefs);
  const eraser = useShapeEraser({
    sceneCanvasRef,
    overlayCanvasRef,
    pointerRefs,
  });
  const pointerHelpers = usePointer(overlayCanvasRef, pointerRefs);
  const canvasCursor = useCanvasCursor({
    overlayCanvasRef,
    pointerRefs,
  });
  const { invalidate } = useCanvasRenderer();
  const move = useShapeMove(sceneCanvasRef, overlayCanvasRef, pointerRefs);
  const resize = useShapeResize(overlayCanvasRef, pointerRefs);
  const text = useTextEditing(sceneCanvasRef, textareaRef);

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
        text.startEditingText(startPoint);
        break;

      default:
        pointerRefs.interactionRef.current = {
          type: "draw",
          previewShape: null,
        };

        // Set States for drawing tools with points
        drawing.onPointerDownDrawing(event);
    }
  }

  function routePointerMove(
    event: React.PointerEvent<HTMLCanvasElement>,
    endPoint: Point,
  ) {
    const isPointerDown = pointerRefs.isPointerDownRef.current;

    switch (selectedTool) {
      case "pan":
        if (isPointerDown) {
          handlePanMove(event.clientX, event.clientY);
        }
        return;

      case "select": {
        selection.onPointerMoveSelection(endPoint);
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
    const pointerDownTime = pointerRefs.pointerDownTimeRef.current;

    // Always reset the timestamp before returning.
    pointerRefs.pointerDownTimeRef.current = null;

    if (!pointerDownTime) return;
    if (!selectedShape || selectedShape.type !== "text") return;

    const interaction = pointerRefs.interactionRef.current;

    // Only allow editing after a simple click, not a drag or resize
    if (interaction.type !== "select") return;

    const duration = performance.now() - pointerDownTime;

    if (duration > 250) return;

    setTextEditingState({ ...selectedShape });
    setSelectedShape(null);
  }

  function handleEraseEnd() {
    if (selectedTool === "eraser") {
      eraser.onPointerUpErase();
    }
  }

  function handleToolReset() {
    if (!isLocked && !STICKY_TOOLS.has(selectedTool)) {
      setSelectedTool("select");
    }
  }

  // ============== DOM Pointer Events Handlers ==============
  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    event.preventDefault();
    text.finishEditingIfClickedOutside(event);

    // Sets the required initial states for Middle Mouse Pan
    if (pointerHelpers.handleMiddleMousePan(event)) {
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

    routePointerMove(event, endPoint);
  }

  function handlePointerUp(event: PointerEvent<HTMLCanvasElement>) {
    handleTextEditingOnPointerUp();

    const interaction = pointerRefs.interactionRef.current;

    switch (interaction.type) {
      case "draw":
        drawing.onPointerUpDrawing(event);
        break;

      case "move":
        move.onPointerUp();
        break;

      case "resize":
        resize.onPointerUp();
        break;

      // case "rotate":
      //   rotate.onPointerUp();
      //   break;
    }

    handleToolReset();

    pointerHelpers.resetPointerState();
    pointerRefs.eraserTrailRef.current = [];
    canvasCursor.updateCursor();

    pointerRefs.interactionRef.current.type = "select";

    invalidate();
  }

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}
