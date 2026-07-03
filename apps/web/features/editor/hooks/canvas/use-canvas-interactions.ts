import { Dispatch, PointerEvent, RefObject, SetStateAction } from "react";
import * as store from "../../store/editor/selectors";
import { usePointerState } from "../pointer/use-pointer-state";
import useCanvasCursor from "./use-canvas-cursor";
import { Point } from "../../types/types";
import usePan from "../viewport/use-viewport-pan";
import usePointer from "../pointer/use-pointer-helpers";
import useTextEditing from "../text/use-text-editing";
import useShapeDrawing from "../interactions/use-shape-drawing";
import useSelectionActions from "../interactions/use-selection-actions";
import useShapeEraser from "../interactions/use-shape-eraser";
import useShapeMove from "../interactions/use-shape-move";
import useShapeResize from "../interactions/use-shape-resize";
import { useCanvasRenderer } from "../../context/use-renderer";
import { preLogSerializationClone } from "next/dist/next-devtools/userspace/app/forward-logs-utils";

const STICKY_TOOLS = new Set(["pan", "freedraw", "eraser"]);

export default function useCanvasInteractions({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
  textareaRef,
  closeContextMenu,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  closeContextMenu: () => void;
}) {
  const selectedTool = store.useSelectedTool();
  const setTextEditingState = store.useSetTextEditingState();
  const setSelectedTool = store.useSetSelectedTool();
  const isLocked = store.useIsLocked();
  const selectedShapeIds = store.useSelectedShapeIds();
  const setSelectedShapeIds = store.useSetSelectedShapeIds();
  const shapes = store.useShapes();

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
        selection.onPointerDownSelection(startPoint, event.shiftKey);
        break;

      case "text":
        text.onPointerDownText(startPoint);
        break;

      case "eraser":
        eraser.onPointerMoveErase(startPoint);
        return;

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

    const selectedShape = shapes.find((shape) =>
      selectedShapeIds.includes(shape.id),
    );

    if (!selectedShape || selectedShape.type !== "text") return;

    const interaction = pointerRefs.interactionRef.current;

    // Only allow editing after a simple click, not a drag or resize
    if (interaction.type !== "select") return;

    const duration = performance.now() - pointerDownTime;

    if (duration > 250) return;

    setTextEditingState({ ...selectedShape });
    setSelectedShapeIds([]);
  }

  function handleToolReset() {
    if (!isLocked && !STICKY_TOOLS.has(selectedTool)) {
      setSelectedTool("select");
    }
  }

  // ============== DOM Pointer Events Handlers ==============
  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (event.button === 2) return;
    closeContextMenu();

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
    if (selectedTool !== "select") {
      canvasCursor.updateCursor();
    }

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
    if (!overlayCanvasRef.current) return;
    overlayCanvasRef.current.releasePointerCapture(event.pointerId);

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

      case "selection-box":
        selection.onPointerUpSelection(event.shiftKey);
        break;

      // case "rotate":
      //   rotate.onPointerUp();
      //   break;
    }

    handleToolReset();

    pointerHelpers.resetPointerState();
    pointerRefs.eraserTrailRef.current = [];

    invalidate();
  }

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}
