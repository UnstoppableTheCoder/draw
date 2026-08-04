import { RefObject } from "react";
import { useParams } from "next/navigation";
import { generateKeyBetween } from "fractional-indexing";

import {
  usePushHistory,
  useSetHoveredFrameId,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";
import { getBoundingBox } from "../../geometry/bounding-box/get-bounding-box";
import { checkIsInsideFrame, getGroupBounds } from "../selection/use-selection";
import { usePointerState } from "../../pointer/use-pointer-state";
import { FrameShape, Point, Shape } from "../../types";
import { updateShapesApi } from "../../networking/api/shape-api";

/**
 * Generates a fractional z-index after the supplied z-index.
 */
export function getNextZIndex(lastZIndex: string | null): string {
  return generateKeyBetween(lastZIndex, null);
}

/**
 * Generates a fractional z-index before the supplied z-index.
 */
export function getPreviousZIndex(firstZIndex: string | null): string {
  return generateKeyBetween(null, firstZIndex);
}

/**
 * Generates a fractional z-index between two existing z-indices.
 */
export function getZIndexBetween(
  below: string | null,
  above: string | null,
): string {
  return generateKeyBetween(below, above);
}

function compareBinary(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareByZIndex(a: Shape, b: Shape): number {
  return compareBinary(a.zIndex, b.zIndex) || compareBinary(a.id, b.id);
}

function didShapeChange(previous: Shape, next: Shape): boolean {
  return (
    previous.x !== next.x ||
    previous.y !== next.y ||
    previous.frameId !== next.frameId ||
    previous.zIndex !== next.zIndex
  );
}

interface ShapeOrderIndex {
  orderedShapes: Shape[];
  shapesById: Map<string, Shape>;
  shapesByFrameId: Map<string | null, Shape[]>;
}

interface InsertionBounds {
  below: string | null;
  above: string | null;
}

interface ComputeMovedShapesOptions {
  currentShapes: Shape[];
  previewShapes: Shape[];
  selectedShapeIds: ReadonlySet<string>;
  destinationFrameId: string | null;
}

interface ComputeMovedShapesResult {
  finalShapes: Shape[];
  changedShapes: Shape[];
}

/**
 * Creates indexes for the unmoved shapes.
 *
 * Array order is ignored. Shapes are ordered exclusively by zIndex.
 */
function buildShapeOrderIndex(
  shapes: readonly Shape[],
  excludedShapeIds: ReadonlySet<string>,
): ShapeOrderIndex {
  const orderedShapes = shapes
    .filter((shape) => !excludedShapeIds.has(shape.id))
    .sort(compareByZIndex);

  const shapesById = new Map<string, Shape>();
  const shapesByFrameId = new Map<string | null, Shape[]>();

  for (const shape of orderedShapes) {
    shapesById.set(shape.id, shape);

    const frameId = shape.frameId ?? null;
    const siblings = shapesByFrameId.get(frameId) ?? [];

    siblings.push(shape);
    shapesByFrameId.set(frameId, siblings);
  }

  return {
    orderedShapes,
    shapesById,
    shapesByFrameId,
  };
}

/**
 * Returns the selected roots of the moved forest.
 *
 * If a frame and its child are moved together, only the frame changes its
 * containing frame. The child remains inside the moved frame.
 */
function getMovedRootIds(
  previewShapes: readonly Shape[],
  selectedShapeIds: ReadonlySet<string>,
): Set<string> {
  const movedShapeIds = new Set(previewShapes.map((shape) => shape.id));
  const movedRootIds = new Set<string>();

  for (const shape of previewShapes) {
    if (!selectedShapeIds.has(shape.id)) {
      continue;
    }

    const parentFrameId = shape.frameId ?? null;

    const movesWithSelectedParent =
      parentFrameId !== null &&
      movedShapeIds.has(parentFrameId) &&
      selectedShapeIds.has(parentFrameId);

    if (!movesWithSelectedParent) {
      movedRootIds.add(shape.id);
    }
  }

  return movedRootIds;
}

/**
 * Gets the fractional-index insertion range.
 *
 * For a frame destination, moved shapes are inserted after its final child.
 * For the top level, moved shapes are appended after the final shape block.
 */
function getDestinationInsertionBounds(
  orderIndex: ShapeOrderIndex,
  destinationFrameId: string | null,
): InsertionBounds {
  if (destinationFrameId === null) {
    return {
      below: orderIndex.orderedShapes.at(-1)?.zIndex ?? null,
      above: null,
    };
  }

  const destinationFrame = orderIndex.shapesById.get(destinationFrameId);

  if (!destinationFrame || destinationFrame.type !== "frame") {
    throw new Error(`Destination frame "${destinationFrameId}" was not found`);
  }

  const destinationChildren =
    orderIndex.shapesByFrameId.get(destinationFrameId) ?? [];

  const below = destinationChildren.at(-1)?.zIndex ?? destinationFrame.zIndex;

  const destinationParentId = destinationFrame.frameId ?? null;

  const destinationSiblings =
    orderIndex.shapesByFrameId.get(destinationParentId) ?? [];

  const destinationIndex = destinationSiblings.findIndex(
    (shape) => shape.id === destinationFrameId,
  );

  if (destinationIndex === -1) {
    throw new Error(
      `Destination frame "${destinationFrameId}" is missing from its parent`,
    );
  }

  return {
    below,
    above: destinationSiblings[destinationIndex + 1]?.zIndex ?? null,
  };
}

/**
 * Applies moved positions, reparents moved roots, and assigns fresh
 * fractional z-index values.
 *
 * The shape array itself is never reordered.
 */
function computeMovedShapes({
  currentShapes,
  previewShapes,
  selectedShapeIds,
  destinationFrameId,
}: ComputeMovedShapesOptions): ComputeMovedShapesResult {
  if (previewShapes.length === 0) {
    return {
      finalShapes: currentShapes,
      changedShapes: [],
    };
  }

  const currentShapesById = new Map(
    currentShapes.map((shape) => [shape.id, shape]),
  );

  const movedShapeIds = new Set(previewShapes.map((shape) => shape.id));
  const movedRootIds = getMovedRootIds(previewShapes, selectedShapeIds);

  const orderIndex = buildShapeOrderIndex(currentShapes, movedShapeIds);

  const { below, above } = getDestinationInsertionBounds(
    orderIndex,
    destinationFrameId,
  );

  /**
   * Preserve the moved forest's existing visual order.
   */
  const orderedMovedShapes = previewShapes
    .map((previewShape) => {
      const currentShape = currentShapesById.get(previewShape.id);

      return currentShape ? { ...currentShape, ...previewShape } : previewShape;
    })
    .sort(compareByZIndex);

  const finalShapesById = new Map(currentShapesById);
  const changedShapes: Shape[] = [];

  let currentLowerBound = below;

  for (const movedShape of orderedMovedShapes) {
    const previousShape = currentShapesById.get(movedShape.id);

    if (!previousShape) {
      continue;
    }

    const nextZIndex = getZIndexBetween(currentLowerBound, above);

    const nextShape: Shape = {
      ...movedShape,

      /**
       * Only roots enter the destination frame.
       *
       * Children of moved frames retain their existing frameId.
       */
      frameId: movedRootIds.has(movedShape.id)
        ? destinationFrameId
        : movedShape.frameId,

      zIndex: nextZIndex,
    };

    finalShapesById.set(nextShape.id, nextShape);
    currentLowerBound = nextZIndex;

    if (didShapeChange(previousShape, nextShape)) {
      changedShapes.push(nextShape);
    }
  }

  /**
   * Preserve the store's array order.
   *
   * Rendering and hit testing must sort by zIndex when visual order is
   * required.
   */
  const finalShapes = currentShapes.map(
    (shape) => finalShapesById.get(shape.id) ?? shape,
  );

  return {
    finalShapes,
    changedShapes,
  };
}

export default function useShapeMove(
  _sceneCanvasRef: RefObject<HTMLCanvasElement | null>,
  _overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const { pageId } = useParams<{ pageId: string }>();

  const shapes = useShapes();
  const setShapes = useSetShapes();
  const pushHistory = usePushHistory();
  const setHoveredFrameId = useSetHoveredFrameId();

  const { invalidate } = useCanvasRenderer();

  /**
   * Finds the visually highest eligible frame containing the selected group.
   */
  function findDestinationFrame(
    selectedPreviewShapes: readonly Shape[],
    movedShapeIds: ReadonlySet<string>,
  ): FrameShape | null {
    const groupBounds = getGroupBounds([...selectedPreviewShapes]);

    if (!groupBounds) {
      return null;
    }

    const candidateFrames = shapes
      .filter(
        (shape): shape is FrameShape =>
          shape.type === "frame" && !movedShapeIds.has(shape.id),
      )
      .sort(compareByZIndex);

    for (let index = candidateFrames.length - 1; index >= 0; index -= 1) {
      const frame = candidateFrames[index];

      if (!frame) {
        continue;
      }

      const frameBounds = getBoundingBox(frame);

      if (checkIsInsideFrame(frameBounds, groupBounds)) {
        return frame;
      }
    }

    return null;
  }

  function moveShapes(currentPoint: Point): void {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "move") {
      return;
    }

    const dx = currentPoint.x - interaction.dragStart.x;
    const dy = currentPoint.y - interaction.dragStart.y;

    const updatedShapes = interaction.previewShapes.map((shape) => {
      const initialPosition = interaction.initialPositions[shape.id];

      if (!initialPosition) {
        return shape;
      }

      return {
        ...shape,
        x: initialPosition.x + dx,
        y: initialPosition.y + dy,
      };
    });

    pointerRefs.interactionRef.current = {
      ...interaction,
      previewShapes: updatedShapes,
    };

    invalidate();
  }

  async function onPointerUp(): Promise<void> {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "move") {
      return;
    }

    const previousShapes = shapes;
    const previewShapes = interaction.previewShapes;

    const selectedPreviewShapes = previewShapes.filter((shape) =>
      interaction.selectedShapesIds.has(shape.id),
    );

    if (selectedPreviewShapes.length === 0) {
      pointerRefs.interactionRef.current = {
        ...interaction,
        type: "select",
      };

      setHoveredFrameId(null);
      invalidate();

      return;
    }

    const movedShapeIds = new Set(previewShapes.map((shape) => shape.id));

    const destinationFrame = findDestinationFrame(
      selectedPreviewShapes,
      movedShapeIds,
    );

    const { finalShapes, changedShapes } = computeMovedShapes({
      currentShapes: previousShapes,
      previewShapes,
      selectedShapeIds: interaction.selectedShapesIds,
      destinationFrameId: destinationFrame?.id ?? null,
    });

    pointerRefs.interactionRef.current = {
      ...interaction,
      previewShapes: changedShapes,
      type: "select",
    };

    setHoveredFrameId(null);

    if (changedShapes.length === 0) {
      invalidate();
      return;
    }

    setShapes(finalShapes);
    pushHistory();
    invalidate();

    try {
      /**
       * Persist the final coordinates, frameId, and generated zIndex values.
       */
      await updateShapesApi(pageId, changedShapes);
    } catch (error) {
      console.error("Failed to persist moved shapes", error);

      setShapes(previousShapes);
      invalidate();
    }
  }

  return {
    moveShapes,
    onPointerUp,
  };
}
