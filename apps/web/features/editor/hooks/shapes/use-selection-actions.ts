import { RefObject } from "react";
import * as store from "../../store/selectors";
import { Point, PointTuple, Shape } from "../../types/types";
import { getShapeAtPosition } from "../../geometry/hit-test";
import {
  getBoundingBox,
  getResizeHandleAtPoint,
} from "../../geometry/bounding-box";
import { getAbsolutePoint } from "../../utils/get-absolute-point";
import useShapeMove from "./use-shape-move";
import useShapeResize from "./use-shape-resize";
import { usePointerState } from "../pointer/use-pointer-state";

export default function useSelectionActions({
  overlayCanvasRef,
  pointerRefs,
}: {
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
}) {
  const shapes = store.useShapes();
  const scale = store.useScale();

  const { moveShape } = useShapeMove(pointerRefs);
  const { resizeShape } = useShapeResize(overlayCanvasRef, pointerRefs);

  function updateResizeCursor(point: Point, shape: Shape) {
    const handle = getResizeHandleAtPoint(
      point,
      shape,
      selectedShapeBounds,
      scale,
    );
    const canvas = overlayCanvasRef.current;

    if (!canvas) return;

    if (!handle) {
      canvas.style.cursor = "all-scroll";
      return;
    }

    switch (handle) {
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

  function onPointerDownSelection(point: Point) {
    pointerRefs.pointerDownTimeRef.current =
      selectedShape?.type === "text" ? performance.now() : null;

    const hitShape = getShapeAtPosition({
      point,
      shapes,
      selectedShape,
      selectedShapeBounds,
    });

    if (!hitShape) {
      return false;
    }

    setSelectedShape(hitShape);
    const bounds = getBoundingBox(hitShape);
    setSelectedShapeBounds(bounds);

    const resizeHandle = getResizeHandleAtPoint(point, hitShape, bounds, scale);

    if (!resizeHandle) {
      pointerRefs.interactionRef.current = {
        type: "move",
        activeShapeId: hitShape.id,
        previewShape: structuredClone(hitShape),
        dragOffset: {
          x: point.x - hitShape.x,
          y: point.y - hitShape.y,
        },
        initialBounds: bounds,
      };

      return true;
    }

    let freeDrawPoints: PointTuple[] | undefined;

    if (hitShape.type === "freedraw") {
      freeDrawPoints = hitShape.points.map(([px, py]) => [
        hitShape.x + px,
        hitShape.y + py,
      ]);
    }

    let lineResizeState:
      | {
          start: Point;
          end: Point;
        }
      | undefined;

    if (hitShape.type === "line" || hitShape.type === "arrow") {
      const [startRel, endRel] = hitShape.points;
      if (!startRel || !endRel) return;

      lineResizeState = {
        start: getAbsolutePoint(hitShape.x, hitShape.y, startRel),
        end: getAbsolutePoint(hitShape.x, hitShape.y, endRel),
      };
    }

    pointerRefs.interactionRef.current = {
      type: "resize",
      activeShapeId: hitShape.id,
      previewShape: structuredClone(hitShape),
      handle: resizeHandle,
      initialBounds: bounds,
      initialFontSize: hitShape.type === "text" ? hitShape.fontSize : undefined,
      freeDrawPoints,
      lineResizeState,
    };

    return true;
  }

  function onPointerMoveSelection(endPoint: Point, dx: number, dy: number) {
    const interaction = pointerRefs.interactionRef.current;

    switch (interaction.type) {
      case "move":
        moveShape(endPoint);
        return true;

      case "resize":
        resizeShape(endPoint);
        return true;
    }

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

    const canvas = overlayCanvasRef.current;

    if (canvas) {
      canvas.style.cursor = "default";
    }

    return false;
  }

  function clearSelection() {
    setSelectedShape(null);
    setSelectedShapeBounds(null);
  }

  return {
    onPointerDownSelection,
    onPointerMoveSelection,
    clearSelection,
  };
}
