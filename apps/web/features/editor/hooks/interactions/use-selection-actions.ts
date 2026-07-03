import { RefObject } from "react";
import * as store from "../../store/editor/selectors";
import { Point, PointTuple, SelectedBounds, Shape } from "../../types/types";
import { getAbsolutePoint } from "../../geometry/get-absolute-point";
import useShapeMove from "./use-shape-move";
import useShapeResize from "./use-shape-resize";
import {
  InteractionState,
  usePointerState,
} from "../pointer/use-pointer-state";
import useCanvasCursor from "../canvas/use-canvas-cursor";
import { useCanvasRenderer } from "../../context/use-renderer";
import { ResizeHandleType } from "../../types/resize-handle";
import { DRAG_THRESHOLD } from "../../constants/canvas";
import { getBoundingBox } from "../../geometry/bounding-box/get-bounding-box";
import { getShapeAtPosition } from "../../geometry/hit-test/get-shape-at-position";
import { isPointInSelectedShapeBounds } from "../../geometry/hit-test/is-point-in-selected-bounds";
import { getResizeHandleAtPoint } from "../../geometry/resize-handles/get-reisze-handle-at-point";
import { useEditorStore } from "../../store/editor/editor-store";

export function getGroupBounds(shapes: Shape[]): SelectedBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const shape of shapes) {
    const bounds = getBoundingBox(shape);

    minX = Math.min(minX, bounds.minX);
    minY = Math.min(minY, bounds.minY);

    maxX = Math.max(maxX, bounds.maxX);
    maxY = Math.max(maxY, bounds.maxY);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}

export default function useSelectionActions({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
}) {
  const scale = store.useScale();
  const { setSelectedShapeIds } = useEditorStore.getState();

  const { moveShapes } = useShapeMove(
    sceneCanvasRef,
    overlayCanvasRef,
    pointerRefs,
  );
  const { resizeShapes } = useShapeResize(overlayCanvasRef, pointerRefs);
  const { updateCursor, updateHoverCursor } = useCanvasCursor({
    overlayCanvasRef,
    pointerRefs,
  });
  const { invalidate } = useCanvasRenderer();

  function createResizeInteractionData(previewShapes: Shape[]) {
    const data: {
      initialFontSizes?: Record<string, number>;
      freeDrawPoints?: Record<string, PointTuple[]>;
      lineResizeStates?: Record<
        string,
        {
          start: Point;
          end: Point;
        }
      >;
    } = {};

    for (const previewShape of previewShapes) {
      if (previewShape.type === "text") {
        if (!data.initialFontSizes) {
          data.initialFontSizes = {};
        }
        data.initialFontSizes[previewShape.id] = previewShape.fontSize;
      }

      if (previewShape.type === "freedraw") {
        if (!data.freeDrawPoints) {
          data.freeDrawPoints = {};
        }
        data.freeDrawPoints[previewShape.id] = previewShape.points.map(
          ([px, py]) => [previewShape.x + px, previewShape.y + py],
        );
      }

      if (previewShape.type === "line" || previewShape.type === "arrow") {
        const [startRel, endRel] = previewShape.points;

        if (startRel && endRel) {
          if (!data.lineResizeStates) {
            data.lineResizeStates = {};
          }
          data.lineResizeStates[previewShape.id] = {
            start: getAbsolutePoint(previewShape.x, previewShape.y, startRel),
            end: getAbsolutePoint(previewShape.x, previewShape.y, endRel),
          };
        }
      }
    }

    return data;
  }

  function startSelectInteraction(previewShapes: Shape[]) {
    const groupBounds = getGroupBounds(previewShapes);
    if (!groupBounds) return false;

    pointerRefs.interactionRef.current = {
      type: "select",
      previewShapes,
      groupBounds,
    };

    invalidate();
    return true;
  }

  function startResizeInteraction(
    previewShapes: Shape[],
    groupBounds: SelectedBounds,
    handle: ResizeHandleType,
  ) {
    pointerRefs.interactionRef.current = {
      type: "resize",
      previewShapes,
      handle,
      groupBounds,
      initialGroupBounds: groupBounds,
      initialShapes: cloneShapes(previewShapes),
      ...createResizeInteractionData(previewShapes),
    };

    invalidate();
  }

  function cloneShapes(shapes: Shape[]) {
    return shapes.map((shape) => structuredClone(shape));
  }

  function updateSelectionHover(point: Point) {
    const { selectedShapeIds, shapes } = useEditorStore.getState();

    const selectedShapes = shapes.filter((shape) =>
      selectedShapeIds.includes(shape.id),
    );
    const groupBounds =
      selectedShapes.length > 0 ? getGroupBounds(selectedShapes) : null;

    if (groupBounds && isPointInSelectedShapeBounds(point, groupBounds)) {
      updateHoverCursor(point, undefined);
      return;
    }

    const hoveredShape = getShapeAtPosition({
      point,
      shapes,
    });

    if (hoveredShape) {
      updateHoverCursor(point, hoveredShape);
      return;
    }

    updateCursor();
  }

  function beginMoveInteraction(
    interaction: Extract<InteractionState, { type: "select" }>,
    point: Point,
  ) {
    const dragOffsets: Record<string, Point> = {};

    for (const previewShape of interaction.previewShapes) {
      dragOffsets[previewShape.id] = {
        x: point.x - previewShape.x,
        y: point.y - previewShape.y,
      };
    }

    pointerRefs.interactionRef.current = {
      type: "move",
      previewShapes: interaction.previewShapes,
      dragOffsets,
      groupBounds: interaction.groupBounds,
    };

    moveShapes(point);
  }

  function getSelectionBoxBounds(
    startPoint: Point,
    endPoint: Point,
  ): SelectedBounds {
    const minX = Math.min(startPoint.x, endPoint.x);
    const minY = Math.min(startPoint.y, endPoint.y);
    const maxX = Math.max(startPoint.x, endPoint.x);
    const maxY = Math.max(startPoint.y, endPoint.y);

    return { minX, minY, maxX, maxY };
  }

  function isShapeWithinBounds(shape: Shape, bounds: SelectedBounds): boolean {
    const shapeBounds = getBoundingBox(shape);

    return (
      shapeBounds.minX >= bounds.minX &&
      shapeBounds.maxX <= bounds.maxX &&
      shapeBounds.minY >= bounds.minY &&
      shapeBounds.maxY <= bounds.maxY
    );
  }

  // Main Functions
  function onPointerDownSelection(point: Point, shiftKey: boolean) {
    const { selectedShapeIds, shapes } = useEditorStore.getState();

    pointerRefs.isDraggingRef.current = false;

    const hitShape = getShapeAtPosition({ point, shapes });

    const selectedShapes = shapes.filter((shape) =>
      selectedShapeIds.includes(shape.id),
    );

    const selectedShape =
      selectedShapes.length === 1 ? selectedShapes[0] : null;

    pointerRefs.pointerDownTimeRef.current =
      selectedShape?.type === "text" ? performance.now() : null;

    // Shift + Click on a shape to add/remove it from the selection
    if (shiftKey) {
      if (!hitShape) return;

      const nextSelectedIds = selectedShapeIds.includes(hitShape.id)
        ? selectedShapeIds.filter((id) => id !== hitShape.id)
        : [...selectedShapeIds, hitShape.id];

      setSelectedShapeIds(nextSelectedIds);

      const previewShapes = cloneShapes(
        shapes.filter((shape) => nextSelectedIds.includes(shape.id)),
      );

      startSelectInteraction(previewShapes);
      return;
    }

    // Clicked on empty space
    if (!hitShape) {
      const groupBounds =
        selectedShapes.length > 0 ? getGroupBounds(selectedShapes) : null;

      // Clicked inside the current selection box
      if (groupBounds && isPointInSelectedShapeBounds(point, groupBounds)) {
        const previewShapes = cloneShapes(selectedShapes);

        const resizeHandle = getResizeHandleAtPoint({
          point,
          shapes: selectedShapes,
          bounds: groupBounds,
          scale,
        });

        if (resizeHandle) {
          startResizeInteraction(previewShapes, groupBounds, resizeHandle);
          return;
        }

        startSelectInteraction(previewShapes);
        return;
      }

      // Clicked outside the current selection, start a new selection box
      pointerRefs.interactionRef.current = {
        type: "selection-box",
        startPoint: point,
        endPoint: point,
      };

      invalidate();
      return;
    }

    const isAlreadySelected = selectedShapeIds.includes(hitShape.id);
    // Clicked an unselected shape
    if (!isAlreadySelected) {
      setSelectedShapeIds([hitShape.id]);

      const previewShape = structuredClone(hitShape);

      pointerRefs.interactionRef.current = {
        type: "select",
        previewShapes: [previewShape],
        groupBounds: getBoundingBox(previewShape),
      };

      invalidate();
      return;
    }

    // Clicked inside the current selection
    const previewShapes = cloneShapes(selectedShapes);
    const groupBounds = getGroupBounds(previewShapes);
    if (!groupBounds) return;

    const resizeHandle = getResizeHandleAtPoint({
      point,
      shapes: previewShapes,
      bounds: groupBounds,
      scale,
    });

    if (resizeHandle) {
      startResizeInteraction(previewShapes, groupBounds, resizeHandle);
      return;
    }

    startSelectInteraction(previewShapes);
  }

  function onPointerMoveSelection(endPoint: Point) {
    const { shapes } = useEditorStore.getState();

    const interaction = pointerRefs.interactionRef.current;

    const start = pointerRefs.drawingStartRef.current;
    if (!start) return;

    switch (interaction.type) {
      case "select": {
        if (!pointerRefs.isPointerDownRef.current) break;

        const dx = endPoint.x - start.x;
        const dy = endPoint.y - start.y;

        const isDragging =
          Math.abs(dx) >= DRAG_THRESHOLD || Math.abs(dy) >= DRAG_THRESHOLD;
        if (!isDragging) break;

        pointerRefs.isDraggingRef.current = true;
        beginMoveInteraction(interaction, endPoint);
        return;
      }

      case "move":
        moveShapes(endPoint);
        return;

      case "resize":
        resizeShapes(endPoint);
        return;

      case "selection-box":
        pointerRefs.interactionRef.current = {
          ...interaction,
          endPoint,
        };
        pointerRefs.isDraggingRef.current = true;

        const selectionBoxBounds = getSelectionBoxBounds(
          interaction.startPoint,
          endPoint,
        );

        const selectedShapeIdsInBox = shapes
          .filter((shape) => isShapeWithinBounds(shape, selectionBoxBounds))
          .map((shape) => shape.id);

        setSelectedShapeIds(selectedShapeIdsInBox);
        invalidate();
        return;

      case "draw":
      case "none":
        break;
    }

    if (pointerRefs.isPointerDownRef.current) return;

    updateSelectionHover(endPoint);
  }

  function onPointerUpSelection(shiftKey: boolean) {
    const interaction = pointerRefs.interactionRef.current;

    if (
      interaction.type === "selection-box" &&
      !pointerRefs.isDraggingRef.current
    ) {
      setSelectedShapeIds([]);
    }

    pointerRefs.interactionRef.current = {
      type: "none",
    };
  }

  return {
    onPointerDownSelection,
    onPointerMoveSelection,
    onPointerUpSelection,
    updateSelectionHover,
  };
}
