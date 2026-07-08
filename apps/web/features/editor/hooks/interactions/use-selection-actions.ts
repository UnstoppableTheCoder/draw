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
import { DRAG_THRESHOLD, TOLERANCE } from "../../constants/canvas";
import { getBoundingBox } from "../../geometry/bounding-box/get-bounding-box";
import { getShapeAtPosition } from "../../geometry/hit-test/get-shape-at-position";
import { isPointInSelectedShapeBounds } from "../../geometry/hit-test/is-point-in-selected-bounds";
import { getResizeHandleAtPoint } from "../../geometry/resize-handles/get-reisze-handle-at-point";
import { useEditorStore } from "../../store/editor/editor-store";
import { pointInSegment } from "../../geometry/hit-test/algorithms/point-in-segment";
import { Group } from "../../store/editor/editor-types";
import { getGroupedShapes } from "../../transform/get-grouped-shapes";

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

  return { minX, minY, maxX, maxY };
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
  const setSelectedShapesIds = store.useSetSelectedShapesIds();
  const shapes = store.useShapes();
  const selectedShapesIds = store.useSelectedShapesIds();
  const setShapes = store.useSetShapes();
  const setIsInsideFrame = store.useSetIsInsideFrame();
  const setParentFrameId = store.useSetParentFrameId();

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
      groupedShapes: getGroupedShapes(previewShapes),
      groupBounds,
    };

    invalidate();
    return;
  }

  function startResizeInteraction(
    previewShapes: Shape[],
    groupBounds: SelectedBounds,
    handle: ResizeHandleType,
  ) {
    pointerRefs.interactionRef.current = {
      type: "resize",
      previewShapes,
      groupedShapes: getGroupedShapes(previewShapes),
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
    const { selectedShapesIds, shapes } = useEditorStore.getState();

    const selectedShapes = shapes.filter((shape) =>
      selectedShapesIds.includes(shape.id),
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
    const selectedShapesDragOffsets: Record<string, Point> = {};
    const framedShapesDragOffsets: Record<string, Point> = {};
    let framedPreviewShapes: Shape[] = [];

    // Calculate Drag Offsets
    interaction.previewShapes.forEach((previewShape) => {
      // Calculate the dragOffsets for the selectedShapes
      selectedShapesDragOffsets[previewShape.id] = {
        x: point.x - previewShape.x,
        y: point.y - previewShape.y,
      };

      // Calculate the dragOffsets for the framedShapes
      if (previewShape.type === "frame") {
        if (previewShape.childIds.length === 0) return;

        const framedShapesIds = new Set(previewShape.childIds);
        const framedShapes = shapes.filter((shape) =>
          framedShapesIds.has(shape.id),
        );

        for (const framedShape of framedShapes) {
          framedShapesDragOffsets[framedShape.id] = {
            x: point.x - framedShape.x,
            y: point.y - framedShape.y,
          };
        }

        framedPreviewShapes = framedShapes;
      }
    });

    pointerRefs.interactionRef.current = {
      type: "move",
      previewShapes: interaction.previewShapes,
      groupedShapes: getGroupedShapes(interaction.previewShapes),
      selectedShapesDragOffsets,
      framedShapesDragOffsets,
      framedPreviewShapes,
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

  function checkIsInsideFrame(
    frameBounds: SelectedBounds,
    shapesBounds: SelectedBounds,
  ) {
    const { minX, minY, maxX, maxY } = frameBounds;

    const isInside =
      shapesBounds.minX >= minX ||
      shapesBounds.minY >= minY ||
      shapesBounds.maxX <= maxX ||
      shapesBounds.maxY <= maxY;

    return isInside;
  }

  function handleShapesMoveOverFrame(endPoint: Point) {
    const selected = new Set(selectedShapesIds);
    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));

    const hoveredShape = getShapeAtPosition({ point: endPoint, shapes });

    const selectedShapesGroupBounds = getGroupBounds(selectedShapes);

    // Never runs when hovering over its own position
    if (hoveredShape && !selected.has(hoveredShape.id)) {
      const frameBounds = getBoundingBox(hoveredShape);

      const isInsideFrame = checkIsInsideFrame(
        frameBounds,
        selectedShapesGroupBounds,
      );

      setParentFrameId(hoveredShape.id);
      setIsInsideFrame(isInsideFrame);
      return;
    }

    setParentFrameId(null);
    setIsInsideFrame(false);
  }

  // Main Functions
  function onPointerDownSelection(point: Point, shiftKey: boolean) {
    // const { selectedShapesIds, shapes } = useEditorStore.getState();

    pointerRefs.isDraggingRef.current = false;

    const hitShape = getShapeAtPosition({ point, shapes });

    const selectedShapes = shapes.filter((shape) =>
      selectedShapesIds.includes(shape.id),
    );

    // For text editing
    const selectedShape =
      selectedShapes.length === 1 ? selectedShapes[0] : null;

    pointerRefs.pointerDownTimeRef.current =
      selectedShape?.type === "text" ? performance.now() : null;

    // Shift + Click on a shape to add/remove it from the selection
    if (shiftKey) {
      if (!hitShape) return;

      const nextSelectedIds = selectedShapesIds.includes(hitShape.id)
        ? selectedShapesIds.filter((id) => id !== hitShape.id)
        : [...selectedShapesIds, hitShape.id];

      setSelectedShapesIds(nextSelectedIds);

      const previewShapes = cloneShapes(
        shapes.filter((shape) => nextSelectedIds.includes(shape.id)),
      );

      startSelectInteraction(previewShapes);
      return;
    }

    // Clicked inside the current selection
    const previewShapes = cloneShapes(selectedShapes);
    const groupBounds = getGroupBounds(previewShapes);
    if (!groupBounds) return;

    // Resize Handle to start resizing
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

    const isAlreadySelected = selectedShapesIds.includes(hitShape.id);
    // Clicked an unselected shape
    if (!isAlreadySelected) {
      setSelectedShapesIds([hitShape.id]);

      const previewHitShape = structuredClone(hitShape);

      const groupId = previewHitShape.groupId;

      // If hit shape belongs to a group
      if (groupId) {
        const groupedPreviewShapes = shapes.filter(
          (shape) => shape.groupId === groupId,
        );

        pointerRefs.interactionRef.current = {
          type: "select",
          previewShapes: groupedPreviewShapes,
          groupedShapes: getGroupedShapes(groupedPreviewShapes),
          groupBounds: getGroupBounds(groupedPreviewShapes),
        };

        setSelectedShapesIds(groupedPreviewShapes.map((shape) => shape.id));

        invalidate();
        return;
      }

      pointerRefs.interactionRef.current = {
        type: "select",
        previewShapes: [previewHitShape],
        groupedShapes: getGroupedShapes([previewHitShape]),
        groupBounds: getBoundingBox(previewHitShape),
      };

      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.type === "frame"
            ? {
                ...shape,
                childIds: shape.childIds.filter(
                  (id) => id !== previewHitShape.id,
                ),
              }
            : shape.id === previewHitShape.id
              ? { ...shape, frameId: null }
              : shape,
        ),
      );
      setSelectedShapesIds([previewHitShape.id]);

      invalidate();
      return;
    }

    startSelectInteraction(previewShapes);
  }

  function onPointerMoveSelection(endPoint: Point) {
    const { shapes, selectedShapesIds } = useEditorStore.getState();
    const selected = new Set(selectedShapesIds);
    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));

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
        handleShapesMoveOverFrame(endPoint);
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

        const selectedShapesInBox = shapes.filter((shape) =>
          isShapeWithinBounds(shape, selectionBoxBounds),
        );
        const selectedShapesIdsInBox = selectedShapesInBox.map(
          (shape) => shape.id,
        );

        pointerRefs.interactionRef.current = {
          ...pointerRefs.interactionRef.current,
          previewShapes: selectedShapesInBox,
          groupedShapes: getGroupedShapes(selectedShapesInBox),
          groupBounds: getGroupBounds(selectedShapesInBox),
        };

        setSelectedShapesIds(selectedShapesIdsInBox);
        invalidate();
        return;

      case "draw":
      case "none":
        break;
    }

    if (pointerRefs.isPointerDownRef.current) return;

    // Hover
    if (selectedShapes.length === 1) {
      const selectedShape = selectedShapes[0];
      if (selectedShape?.type === "arrow" || selectedShape?.type === "line") {
        if (pointInSegment(endPoint, selectedShape, TOLERANCE)) {
          updateHoverCursor(endPoint, undefined);
          return;
        }

        if (
          isPointInSelectedShapeBounds(endPoint, getGroupBounds(selectedShapes))
        ) {
          return;
        }
      }
    }

    updateSelectionHover(endPoint);
  }

  function onPointerUpSelection(shiftKey: boolean) {
    const interaction = pointerRefs.interactionRef.current;

    if (
      interaction.type === "selection-box" &&
      !pointerRefs.isDraggingRef.current
    ) {
      setSelectedShapesIds([]);
    }

    pointerRefs.interactionRef.current.type = "select";
  }

  return {
    onPointerDownSelection,
    onPointerMoveSelection,
    onPointerUpSelection,
    updateSelectionHover,
  };
}
