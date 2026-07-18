import {
  usePushHistory,
  useSetHoveredFrameId,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { RefObject } from "react";
import { useCanvasRenderer } from "../../context/use-renderer";
import { getBoundingBox } from "../../geometry/bounding-box/get-bounding-box";
import { checkIsInsideFrame, getGroupBounds } from "../selection/use-selection";
import { usePointerState } from "../../pointer/use-pointer-state";
import { FrameShape, Point, Shape } from "../../types";
import { updateShapes } from "../../networking/api/shape-api";
import { useParams } from "next/navigation";

export default function useShapeMove(
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>,
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const { pageId } = useParams<{ pageId: string }>();

  const setShapes = useSetShapes();
  const shapes = useShapes();
  const pushHistory = usePushHistory();
  const setHoveredFrameId = useSetHoveredFrameId();

  const interaction = pointerRefs.interactionRef.current;

  const { invalidate, invalidateScene } = useCanvasRenderer();

  function findContainingFrame(
    shape: Shape,
    frames: FrameShape[],
  ): FrameShape | null {
    const shapeBounds = getBoundingBox(shape);

    for (let i = frames.length - 1; i >= 0; i--) {
      const frame = frames[i];
      if (!frame) continue;

      const frameBounds = getBoundingBox(frame);

      if (checkIsInsideFrame(frameBounds, shapeBounds)) {
        return frame;
      }
    }

    return null;
  }

  function reorderShapesByFrame(shapes: Shape[]) {
    const result: Shape[] = [];

    // frameId -> children
    const childrenByFrame = new Map<string, Shape[]>();

    // Mapping frameId with its children
    for (const shape of shapes) {
      if (!shape.frameId) continue;

      const children = childrenByFrame.get(shape.frameId) ?? [];
      children.push(shape);

      childrenByFrame.set(shape.frameId, children);
    }

    function addShape(shape: Shape) {
      result.push(shape);

      // If this is a frame, append all of its children
      if (shape.type !== "frame") return;

      const children = childrenByFrame.get(shape.id) ?? [];

      for (const child of children) {
        addShape(child);
      }
    }

    // Start with all top-level shapes (frames)
    for (const shape of shapes) {
      if (shape.frameId) continue;

      addShape(shape);
    }

    return result;
  }

  function moveShapes(currentPoint: Point) {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "move") return;

    const dx = currentPoint.x - interaction.dragStart.x;
    const dy = currentPoint.y - interaction.dragStart.y;

    const updatedShapes = interaction.previewShapes.map((shape) => {
      const initial = interaction.initialPositions[shape.id];
      if (!initial) return shape;

      return {
        ...shape,
        x: initial.x + dx,
        y: initial.y + dy,
      };
    });

    const updatedSelectedShapes = updatedShapes.filter((shape) =>
      interaction.selectedShapesIds.has(shape.id),
    );

    const groupBounds = getGroupBounds(updatedSelectedShapes);
    if (!groupBounds) return;

    pointerRefs.interactionRef.current = {
      ...interaction,
      previewShapes: updatedShapes,
    };

    invalidate();
  }

  function computeMovedShapes(
    currentShapes: Shape[],
    previewShapes: Shape[],
  ): Shape[] {
    const movedShapesMap = new Map(
      previewShapes.map((shape) => [shape.id, shape]),
    );

    // Apply moved positions.
    const updatedShapes = currentShapes.map((shape) => {
      const moved = movedShapesMap.get(shape.id);
      return moved ?? shape;
    });

    const frames = updatedShapes.filter(
      (shape): shape is FrameShape => shape.type === "frame",
    );

    const frameIds = new Set(frames.map((frame) => frame.id));

    // Recompute frame membership.
    for (const shape of updatedShapes) {
      // Skip frames themselves.
      if (shape.type === "frame") continue;

      // Keep existing frame if it still exists.
      if (shape.frameId && frameIds.has(shape.frameId)) {
        continue;
      }

      const parentFrame = findContainingFrame(
        shape,
        frames.filter((frame) => frame.id !== shape.id),
      );

      shape.frameId = parentFrame?.id ?? null;
    }

    return reorderShapesByFrame(updatedShapes);
  }

  async function onPointerUp() {
    const interaction = pointerRefs.interactionRef.current;
    if (interaction.type !== "move") return;

    const previewShapes = interaction.previewShapes;
    const finalShapes = computeMovedShapes(shapes, previewShapes);

    const selectedPreviewShapes = interaction.previewShapes.filter((shape) =>
      interaction.selectedShapesIds.has(shape.id),
    );

    const groupBounds = getGroupBounds(selectedPreviewShapes);
    if (!groupBounds) return;

    pointerRefs.interactionRef.current = {
      ...interaction,
      type: "select",
    };
    setHoveredFrameId(null);

    // Optimistic update.
    setShapes(finalShapes);
    pushHistory();
    // invalidateScene();
    invalidate();

    try {
      await updateShapes(pageId, interaction.previewShapes);
    } catch (error) {
      console.error(error);
      // Optional rollback.
      setShapes(shapes);
      return;
    }
  }

  return {
    moveShapes,
    onPointerUp,
  };
}
