import { RefObject } from "react";
import * as store from "../../store/editor/selectors";
import { Point, PointTuple, SelectedBounds } from "../../types/types";
import { getAbsolutePoint } from "../../geometry/get-absolute-point";
import { useCanvasRenderer } from "../../context/use-renderer";
import { ResizeHandleType } from "../../types/resize-handle";
import { DRAG_THRESHOLD, TOLERANCE } from "../../constants/canvas";
import { getBoundingBox } from "../../geometry/bounding-box/get-bounding-box";
import { getShapeAtPosition } from "../../geometry/hit-test/get-shape-at-position";
import { isPointInSelectedShapeBounds } from "../../geometry/hit-test/is-point-in-selected-bounds";
import { getResizeHandleAtPoint } from "../../geometry/resize-handles/get-resize-handle-at-point";
import { useEditorStore } from "../../store/editor/editor-store";
import { pointInSegment } from "../../geometry/hit-test/algorithms/point-in-segment";
import useCanvasCursor from "../../renderer/cursor/use-canvas-cursor";
import useShapeMove from "../move/use-shape-move";
import useShapeResize from "../resize/use-shape-resize";
import { usePointerState } from "../../pointer/use-pointer-state";
import { FrameShape, Shape } from "../../types";

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

export function checkIsInsideFrame(
  frameBounds: SelectedBounds,
  shapesBounds: SelectedBounds,
) {
  const { minX, minY, maxX, maxY } = frameBounds;

  const isInside =
    shapesBounds.minX >= minX &&
    shapesBounds.minY >= minY &&
    shapesBounds.maxX <= maxX &&
    shapesBounds.maxY <= maxY;

  return isInside;
}

export function getFrameChildren(frameId: string, shapes: Shape[]) {
  return shapes.filter((shape) => shape.frameId === frameId);
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
  const setHoveredFrameId = store.useSetHoveredFrameId();

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

        data.initialFontSizes[previewShape.id] = previewShape.data.fontSize;
      }

      if (previewShape.type === "freedraw") {
        if (!data.freeDrawPoints) {
          data.freeDrawPoints = {};
        }

        data.freeDrawPoints[previewShape.id] = previewShape.data.points.map(
          ([px, py]) => [previewShape.x + px, previewShape.y + py],
        );
      }

      if (previewShape.type === "line" || previewShape.type === "arrow") {
        const [startRel, endRel] = previewShape.data.points;

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

  function startResizeInteraction(
    previewShapes: Shape[],
    selectedShapesIds: Set<string>,
    groupBounds: SelectedBounds,
    handle: ResizeHandleType,
  ) {
    const initialShapes = cloneShapes(previewShapes);

    pointerRefs.interactionRef.current = {
      type: "resize",
      handle,

      previewShapes,
      selectedShapesIds,

      initialGroupBounds: groupBounds,

      initialShapes,

      ...createResizeInteractionData(initialShapes),
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
      scale,
    });

    if (hoveredShape) {
      updateHoverCursor(point, hoveredShape);
      return;
    }

    updateCursor();
  }

  function getInitialPositions(shapes: Shape[]): Record<string, Point> {
    return Object.fromEntries(
      shapes.map((shape) => [
        shape.id,
        {
          x: shape.x,
          y: shape.y,
        },
      ]),
    );
  }

  function initializeSelectionInteraction(
    pointer: Point,
    selectedShapeIds: string[],
  ) {
    const previewShapes: Shape[] = []; // shapes + frames + children shapes

    const selectedIds = new Set(selectedShapeIds);
    const addedShapeIds = new Set<string>();

    const shapeMap = new Map(shapes.map((shape) => [shape.id, shape]));

    function addShape(shape: Shape) {
      if (addedShapeIds.has(shape.id)) return;

      addedShapeIds.add(shape.id);

      const previewShape = structuredClone(shape);

      previewShapes.push(previewShape);

      // Recursively include all descendants if this is a frame.
      if (shape.type !== "frame") return;

      const children = getFrameChildren(shape.id, shapes);

      for (const child of children) {
        addShape(child);
      }
    }

    // Add every selected shape.
    for (const selectedId of selectedIds) {
      const selectedShape = shapeMap.get(selectedId);
      if (!selectedShape) continue;

      addShape(selectedShape);
    }

    // Bounds should only consider the explicitly selected shapes.
    const selectedPreviewShapes = previewShapes.filter((shape) =>
      selectedIds.has(shape.id),
    );

    const groupBounds = getGroupBounds(selectedPreviewShapes);
    if (!groupBounds) return;

    pointerRefs.interactionRef.current = {
      type: "select",
      previewShapes,
      selectedShapesIds: selectedIds,
    };

    invalidate();
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

  function handleShapesMoveOverFrame() {
    const interaction = pointerRefs.interactionRef.current;
    if (interaction.type !== "move") return;

    const selectedPreviewShapes = interaction.previewShapes.filter((shape) =>
      interaction.selectedShapesIds.has(shape.id),
    );

    const selectedBounds = getGroupBounds(selectedPreviewShapes);
    if (!selectedBounds) {
      setHoveredFrameId(null);
      return;
    }

    const frames = structuredClone(
      shapes.filter((shape): shape is FrameShape => shape.type === "frame"),
    );

    const hoveredFrame = frames.reverse().find((frame) => {
      // Don't allow a selected frame to contain itself
      if (interaction.selectedShapesIds.has(frame.id)) {
        return false;
      }

      return checkIsInsideFrame(getBoundingBox(frame), selectedBounds);
    });

    setHoveredFrameId(hoveredFrame?.id ?? null);
  }

  // Main Functions
  function onPointerDownSelection(point: Point, shiftKey: boolean) {
    pointerRefs.isDraggingRef.current = false;

    const hitShape = getShapeAtPosition({ point, shapes, scale });

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

      initializeSelectionInteraction(point, nextSelectedIds);
      return;
    }

    // Clicked inside the current selection
    if (selectedShapes.length > 0) {
      const previewShapes = cloneShapes(selectedShapes);
      const groupBounds = getGroupBounds(previewShapes);

      if (groupBounds) {
        const resizeHandle = getResizeHandleAtPoint({
          point,
          shapes: previewShapes,
          bounds: groupBounds,
          scale,
        });

        if (resizeHandle) {
          startResizeInteraction(
            previewShapes,
            new Set(selectedShapesIds),
            groupBounds,
            resizeHandle,
          );
          return;
        }
      }
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
          startResizeInteraction(
            previewShapes,
            new Set(selectedShapesIds),
            groupBounds,
            resizeHandle,
          );
          return;
        }

        initializeSelectionInteraction(point, selectedShapesIds);
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

      const previewHitShape = hitShape;

      const groupId = previewHitShape.groupId;

      // If hit shape belongs to a group
      if (groupId) {
        const groupedPreviewShapes = shapes.filter(
          (shape) => shape.groupId === groupId,
        );

        const nextSelectedIds = groupedPreviewShapes.map((shape) => shape.id);

        setSelectedShapesIds(nextSelectedIds);
        initializeSelectionInteraction(point, nextSelectedIds);
        return;
      }

      const nextSelectedIds = [previewHitShape.id];

      setSelectedShapesIds(nextSelectedIds);
      initializeSelectionInteraction(point, nextSelectedIds);
      return;
    }

    initializeSelectionInteraction(point, selectedShapesIds);
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

        pointerRefs.interactionRef.current = {
          ...interaction,
          type: "move",

          // Only preview changes
          previewShapes: interaction.previewShapes.map((shape) =>
            interaction.selectedShapesIds.has(shape.id) &&
            shape.type !== "frame"
              ? { ...shape, frameId: null }
              : shape,
          ),
          dragStart: endPoint,
          initialPositions: getInitialPositions(shapes),
        };

        moveShapes(endPoint);
        return;
      }
      case "move":
        moveShapes(endPoint);
        handleShapesMoveOverFrame();
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
