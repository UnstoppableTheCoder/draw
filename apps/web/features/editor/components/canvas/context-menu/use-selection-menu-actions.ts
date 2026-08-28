import { useParams } from "next/navigation";
import { generateKeyBetween } from "fractional-indexing";
import { v4 as uuidv4 } from "uuid";

import { useUser } from "@/features/auth/store/selectors";

import { TOLERANCE } from "@/features/editor/constants/canvas";
import { useCanvasRenderer } from "@/features/editor/context/use-renderer";

import { getGroupBounds } from "@/features/editor/geometry/bounding-box/get-group-bounds";
import { normalizeRect } from "@/features/editor/geometry/normalize-rect";
import getTextDimensions from "@/features/editor/geometry/text/get-text-dimensions";

import { createFrameShape } from "@/features/editor/interactions/draw/create-shape";

import {
  createShapes as createShapesApi,
  deleteShapesApi,
  updateShapesApi,
} from "@/features/editor/networking/api/shape-api";

import {
  usePushHistory,
  useSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "@/features/editor/store/editor/selectors";

import { FrameShape, Shape } from "@/features/editor/types";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareByZIndex(a: Shape, b: Shape): number {
  return compareStrings(a.zIndex, b.zIndex) || compareStrings(a.id, b.id);
}

export default function useSelectionMenuActions({
  overlayCanvasRef,
  pointerRefs,
}: any) {
  const { pageId } = useParams<{ pageId: string }>();

  const user = useUser();

  const shapes = useShapes();
  const setShapes = useSetShapes();
  const selectedShapesIds = useSelectedShapesIds();

  const pushHistory = usePushHistory();
  const { invalidate } = useCanvasRenderer();

  const group = async () => {
    const selected = new Set(selectedShapesIds);
    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));

    // Conditions
    const selectedCount = selectedShapes.length;
    const isMultipleShapes = selectedCount > 1;
    const hasFramesIncluded = selectedShapes.some(
      (shape) => shape.type === "frame",
    );
    const hasGroupedShapes = selectedShapes.some((shape) => shape.groupId);

    // Guard clauses
    if (!isMultipleShapes || hasFramesIncluded || hasGroupedShapes) {
      return;
    }

    const groupId = uuidv4();

    const previousShapes = shapes;
    const changedShapes: Shape[] = [];

    const nextShapes = previousShapes.map((shape) => {
      if (!selected.has(shape.id)) {
        return shape;
      }

      const updatedShape = {
        ...shape,
        groupId,
      };

      changedShapes.push(updatedShape);
      return updatedShape;
    });

    setShapes(nextShapes);
    pushHistory();
    invalidate();

    try {
      await updateShapesApi(pageId, changedShapes);
    } catch (error) {
      console.error("Failed to group shapes", error);

      setShapes(previousShapes);
      invalidate();
    }
  };

  const unGroup = async () => {
    const selected = new Set(selectedShapesIds);

    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));

    // Conditions
    const hasFramesIncluded = selectedShapes.some(
      (shape) => shape.type === "frame",
    );

    const hasGroupedShapes = selectedShapes.some((shape) => shape.groupId);

    // Guard clauses
    if (hasFramesIncluded || !hasGroupedShapes) {
      return;
    }

    const selectedGroups = new Set(
      selectedShapes
        .filter((shape): shape is Shape => shape.groupId != null)
        .map((shape) => shape.groupId),
    );

    const previousShapes = shapes;
    const changedShapes: Shape[] = [];

    const nextShapes = previousShapes.map((shape) => {
      if (!shape.groupId || !selectedGroups.has(shape.groupId)) {
        return shape;
      }

      const updatedShape = {
        ...shape,
        groupId: null,
      };

      changedShapes.push(updatedShape);
      return updatedShape;
    });

    setShapes(nextShapes);
    pushHistory();
    invalidate();

    try {
      await updateShapesApi(pageId, changedShapes);
    } catch (error) {
      console.error("Failed to ungroup shapes", error);

      setShapes(previousShapes);
      invalidate();
    }
  };

  const wrapInFrame = async () => {
    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    const selectedIds = new Set(selectedShapesIds);
    const shapesById = new Map(shapes.map((shape) => [shape.id, shape]));

    function hasSelectedAncestor(shape: Shape): boolean {
      let parentId = shape.frameId;

      while (parentId) {
        if (selectedIds.has(parentId)) {
          return true;
        }

        const parent = shapesById.get(parentId);

        if (!parent || parent.type !== "frame") {
          break;
        }

        parentId = parent.frameId;
      }

      return false;
    }

    // Only wrap the highest selected nodes.
    const shapesToWrap = shapes.filter(
      (shape) => selectedIds.has(shape.id) && !hasSelectedAncestor(shape),
    );

    if (shapesToWrap.length === 0) {
      return;
    }

    const bounds = getGroupBounds(shapesToWrap);
    if (!bounds) {
      return;
    }

    const tolerance = 5 * TOLERANCE;
    const rect = normalizeRect(
      {
        x: bounds.minX - tolerance,
        y: bounds.minY - tolerance,
      },
      {
        x: bounds.maxX + tolerance,
        y: bounds.maxY + tolerance,
      },
    );

    const data = {
      name: "Frame Name",
      fontSize: 14,
      fontFamily: "Virgil",
    };

    // New frame belongs to the same parent as the wrapped nodes.
    const parentFrameId = shapesToWrap[0]!.frameId ?? null;

    // Shapes sorted back -> front.
    const orderedShapes = [...shapes].sort(compareByZIndex);

    const wrapIds = new Set(shapesToWrap.map((shape) => shape.id));
    const firstShape = orderedShapes.find((shape) => wrapIds.has(shape.id));

    if (!firstShape) {
      return;
    }

    const firstIndex = orderedShapes.indexOf(firstShape);
    const lower = firstIndex > 0 ? orderedShapes[firstIndex - 1]!.zIndex : null;
    const upper = firstShape.zIndex;

    const frame = createFrameShape({
      rect,
      text: {
        ...data,
        ...getTextDimensions({
          ctx,
          text: data.name,
          fontSize: data.fontSize,
          fontFamily: data.fontFamily,
        }),
      },
      zIndex: generateKeyBetween(lower, upper),
      pageId,
      createdById: user!.id,
    });
    frame.frameId = parentFrameId;

    const previousShapes = shapes;
    const changedShapes: Shape[] = [];

    const nextShapes = previousShapes.map((shape) => {
      if (!wrapIds.has(shape.id)) {
        return shape;
      }

      const updatedShape: Shape = {
        ...shape,
        frameId: frame.id,
      };

      changedShapes.push(updatedShape);
      return updatedShape;
    });

    const finalShapes = [...nextShapes, frame].sort(compareByZIndex);

    setShapes(finalShapes);
    pushHistory();
    invalidate();

    try {
      await Promise.all([
        createShapesApi(pageId, [frame]),
        updateShapesApi(pageId, changedShapes),
      ]);
    } catch (error) {
      console.error("Failed to wrap shapes in frame", error);

      setShapes(previousShapes);
      invalidate();
    }
  };

  const removeFrame = async () => {
    const selectedIds = new Set(selectedShapesIds);

    const selectedShapes = shapes.filter((shape) => selectedIds.has(shape.id));

    // Conditions
    const hasGroupedShapes = selectedShapes.some((shape) => shape.groupId);
    const hasFramesIncluded = selectedShapes.some(
      (shape) => shape.type === "frame",
    );
    const hasFrameChildren = selectedShapes.some((shape) => shape.frameId);

    const removeFrame =
      (hasFramesIncluded || hasFrameChildren) && !hasGroupedShapes;

    // Guard clause
    if (!removeFrame) {
      return;
    }

    const previousShapes = shapes;
    const changedShapes: Shape[] = [];

    const frame = selectedShapes.find(
      (shape): shape is FrameShape => shape.type === "frame",
    );

    // A frame is selected -> remove the frame
    if (frame) {
      const nextShapes = previousShapes
        .map((shape) => {
          if (shape.frameId === frame.id) {
            const updatedShape = {
              ...shape,
              frameId: frame.frameId, // Preserve nesting.
            };

            changedShapes.push(updatedShape);
            return updatedShape;
          }

          return shape;
        })
        .filter((shape) => shape.id !== frame.id);

      setShapes(nextShapes);
      pushHistory();
      invalidate();

      try {
        await Promise.all([
          updateShapesApi(pageId, changedShapes),
          deleteShapesApi(pageId, [frame.id]),
        ]);
      } catch (error) {
        console.error("Failed to remove frame", error);

        setShapes(previousShapes);
        invalidate();
      }

      return;
    }

    // Selected shapes are inside a frame -> detach them
    const nextShapes = previousShapes.map((shape) => {
      if (selectedIds.has(shape.id) && shape.frameId) {
        const updatedShape = {
          ...shape,
          frameId: null,
        };

        changedShapes.push(updatedShape);
        return updatedShape;
      }

      return shape;
    });

    if (changedShapes.length === 0) {
      return;
    }

    setShapes(nextShapes);
    pushHistory();
    invalidate();

    try {
      await updateShapesApi(pageId, changedShapes);
    } catch (error) {
      console.error("Failed to detach shapes from frame", error);

      setShapes(previousShapes);
      invalidate();
    }
  };

  return {
    group,
    unGroup,
    wrapInFrame,
    removeFrame,
  };
}
