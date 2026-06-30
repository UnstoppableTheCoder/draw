import { RefObject } from "react";
import * as store from "../../store/selectors";
import { Point, PointTuple } from "../../types/types";
import { getShapeAtPosition } from "../../geometry/hit-test";
import {
  getBoundingBox,
  getResizeHandleAtPoint,
} from "../../geometry/bounding-box";
import { getAbsolutePoint } from "../../utils/get-absolute-point";
import useShapeMove from "./use-shape-move";
import useShapeResize from "./use-shape-resize";
import { usePointerState } from "../pointer/use-pointer-state";
import useCanvasCursor from "../canvas/use-canvas-cursor";
import { useCanvasRenderer } from "../../renderer/use-renderer";

const DRAG_THRESHOLD = 2;

export default function useSelectionActions({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
}) {
  const shapes = store.useShapes();
  const scale = store.useScale();
  const selectedShape = store.useSelectedShape();
  const setSelectedShape = store.useSetSelectedShape();

  const { moveShape } = useShapeMove(
    sceneCanvasRef,
    overlayCanvasRef,
    pointerRefs,
  );
  const { resizeShape } = useShapeResize(overlayCanvasRef, pointerRefs);
  const { updateCursor, updateHoverCursor } = useCanvasCursor({
    overlayCanvasRef,
    pointerRefs,
  });
  const { invalidate, invalidateOverlay, invalidateScene } =
    useCanvasRenderer();
  const textEditingState = store.useTextEditingState();

  function onPointerDownSelection(point: Point) {
    pointerRefs.pointerDownTimeRef.current =
      selectedShape?.type === "text" ? performance.now() : null;

    const hitShape = getShapeAtPosition({
      point,
      shapes,
      selectedShape,
    });

    if (!hitShape) {
      setSelectedShape(null);

      pointerRefs.interactionRef.current = {
        type: "selection-box",
        startPoint: point,
        endPoint: point,
      };

      invalidate();
      return;
    }

    setSelectedShape(hitShape);

    const bounds = getBoundingBox(hitShape);
    const previewShape = structuredClone(hitShape);

    const resizeHandle = getResizeHandleAtPoint({
      point,
      shape: hitShape,
      bounds,
      scale,
    });

    if (!resizeHandle) {
      pointerRefs.interactionRef.current = {
        type: "select",
        activeShapeId: hitShape.id,
        previewShape,
        bounds,
      };

      // Rendering both when clicked on the shape
      invalidate();
      return;
    }

    // Resize Interaction
    let freeDrawPoints: PointTuple[] | undefined;

    if (previewShape.type === "freedraw") {
      freeDrawPoints = previewShape.points.map(([px, py]) => [
        previewShape.x + px,
        previewShape.y + py,
      ]);
    }

    let lineResizeState:
      | {
          start: Point;
          end: Point;
        }
      | undefined;

    if (previewShape.type === "line" || previewShape.type === "arrow") {
      const [startRel, endRel] = previewShape.points;

      if (!startRel || !endRel) {
        return;
      }

      lineResizeState = {
        start: getAbsolutePoint(previewShape.x, previewShape.y, startRel),
        end: getAbsolutePoint(previewShape.x, previewShape.y, endRel),
      };
    }

    pointerRefs.interactionRef.current = {
      type: "resize",
      activeShapeId: hitShape.id,
      previewShape,
      handle: resizeHandle,
      bounds,
      initialBounds: bounds,
      initialFontSize:
        previewShape.type === "text" ? previewShape.fontSize : undefined,
      freeDrawPoints,
      lineResizeState,
    };

    invalidate();
  }

  function onPointerMoveSelection(endPoint: Point) {
    const interaction = pointerRefs.interactionRef.current;
    const start = pointerRefs.drawingStartRef.current;

    if (!start) return;

    switch (interaction.type) {
      case "select": {
        const dx = endPoint.x - start.x;
        const dy = endPoint.y - start.y;

        if (
          pointerRefs.isPointerDownRef.current &&
          interaction.previewShape &&
          (Math.abs(dx) >= DRAG_THRESHOLD || Math.abs(dy) >= DRAG_THRESHOLD)
        ) {
          pointerRefs.interactionRef.current = {
            type: "move",
            previewShape: interaction.previewShape,
            activeShapeId: interaction.previewShape.id,
            bounds: getBoundingBox(interaction.previewShape),
            dragOffset: {
              x: endPoint.x - interaction.previewShape.x,
              y: endPoint.y - interaction.previewShape.y,
            },
          };

          moveShape(endPoint);
          return;
        }

        break;
      }

      case "move":
        moveShape(endPoint);
        return;

      case "resize":
        resizeShape(endPoint);
        return;
    }

    // Only update hover cursor when not dragging
    const hovered = getShapeAtPosition({
      point: endPoint,
      shapes,
      selectedShape,
    });

    if (hovered) {
      updateHoverCursor(endPoint, hovered);
    } else {
      updateCursor();
    }
  }

  return {
    onPointerDownSelection,
    onPointerMoveSelection,
  };
}
