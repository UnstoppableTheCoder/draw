import { Point, PointTuple, Shape } from "../../types/types";
import * as store from "../../store/selectors";
import { getShapeAtPosition } from "../../geometry/hit-test";
import {
  getBoundingBox,
  getResizeHandleAtPoint,
} from "../../geometry/bounding-box";
import { getAbsolutePoint } from "../../utils/get-absolute-point";
import useShapeMove from "./use-shape-move";
import useShapeResize from "./use-shape-resize";
import { usePointerState } from "../pointer/use-pointer-state";

export default function useSelectionActions(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  scale: number,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const selectedShape = store.useSelectedShape();
  const selectedShapeBounds = store.useSelectedShapeBounds();
  const setSelectedShape = store.useSetSelectedShape();
  const setSelectedShapeBounds = store.useSetSelectedShapeBounds();
  const setTextEditingState = store.useSetTextEditingState();
  const shapes = store.useShapes();

  const {
    resizableHandleRef,
    isResizingRef,
    isPointerDownRef,
    resizeStartBoundsRef,
    resizeStartFontSizeRef,
  } = pointerRefs;

  const { moveShape } = useShapeMove();
  const { resizeShape } = useShapeResize(canvasRef, pointerRefs);

  // Handles cursor type change over Selected shape
  function updateResizeCursor(point: Point, selectedShapeLocal: Shape) {
    const resizeHandle = getResizeHandleAtPoint(
      point,
      selectedShapeLocal, // selectedShape or hoveredShape
      selectedShapeBounds, // can be null - if shape is just hovered & not selected
      scale,
    );
    resizableHandleRef.current = resizeHandle;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // When just shape is hovered
    if (!resizeHandle && selectedShapeLocal) {
      canvas.style.cursor = "all-scroll";
      return;
    }

    switch (resizeHandle) {
      case "top":
      case "bottom":
        canvas.style.cursor = "ns-resize";
        break;
      case "left":
      case "right":
        canvas.style.cursor = "ew-resize";
        break;
      case "top-left":
      case "bottom-right":
        canvas.style.cursor = "nwse-resize";
        break;
      case "top-right":
      case "bottom-left":
        canvas.style.cursor = "nesw-resize";
        break;
      case "start":
      case "middle":
      case "end":
        canvas.style.cursor = "pointer";
        break;
    }
  }

  // Handles Select and Resize on Pointer Down
  function onPointerDownSelection(point: Point) {
    if (selectedShape?.type === "text" && selectedShape) {
      pointerRefs.pointerDownTimeRef.current = performance.now();
    } else {
      pointerRefs.pointerDownTimeRef.current = null;
    }

    const shapeAtPosition = getShapeAtPosition({
      point,
      shapes,
      selectedShape,
      selectedShapeBounds,
    });
    if (!shapeAtPosition) return false;

    setSelectedShape(shapeAtPosition);
    const bounds = getBoundingBox(shapeAtPosition);
    setSelectedShapeBounds(bounds);

    // If this is a freedraw shape, capture its absolute points so resize can scale them
    if (shapeAtPosition.type === "freedraw") {
      const absPoints: PointTuple[] = (shapeAtPosition.points || []).map(
        ([px, py]) => [shapeAtPosition.x + px, shapeAtPosition.y + py],
      );

      pointerRefs.freeDrawShapePointsRef.current = absPoints;
    }

    // If resizing a line/arrow, store absolute start/end points for the resize state
    if (shapeAtPosition.type === "line" || shapeAtPosition.type === "arrow") {
      const [startRel, endRel] = shapeAtPosition.points;
      if (!startRel || !endRel) return;

      const startAbs = getAbsolutePoint(
        shapeAtPosition.x,
        shapeAtPosition.y,
        startRel,
      );
      const endAbs = getAbsolutePoint(
        shapeAtPosition.x,
        shapeAtPosition.y,
        endRel,
      );
      pointerRefs.lineResizeStateRef.current = {
        start: startAbs,
        end: endAbs,
      };
    }

    const resizeHandle = getResizeHandleAtPoint(
      point,
      shapeAtPosition,
      bounds,
      scale,
    );

    if (!resizeHandle) {
      isResizingRef.current = false;
      return true;
    }

    isResizingRef.current = true;
    resizableHandleRef.current = resizeHandle;
    resizeStartBoundsRef.current = bounds; // always remains the same

    if (shapeAtPosition.type === "text") {
      resizeStartFontSizeRef.current = shapeAtPosition.fontSize;
    }

    return true;
  }

  // Handles Move, Resize, Cursor Type
  function onPointerMoveSelection(endPoint: Point, dx: number, dy: number) {
    if (selectedShape && pointerRefs.isPointerDownRef.current) {
      pointerRefs.isDraggingRef.current = true;
    }

    // Handle Drag or Resize
    if (selectedShape && isPointerDownRef.current) {
      if (isResizingRef.current) {
        resizeShape(selectedShape, endPoint);
      } else {
        moveShape({
          selectedShape,
          dx,
          dy,
        });
      }
      return true;
    }

    // Hover state
    const hovered = getShapeAtPosition({
      point: endPoint,
      shapes,
      selectedShape,
      selectedShapeBounds,
    });

    if (hovered) {
      updateResizeCursor(endPoint, hovered);
      return true;
    }

    // Nothing hovered -> reset cursor
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = "default";
    }

    return false;
  }

  // Clear Selection
  function clearSelection() {
    setSelectedShape(null);
    setSelectedShapeBounds(null);
  }

  return {
    onPointerDownSelection,
    onPointerMoveSelection,
    updateResizeCursor,
    clearSelection,
  };
}
