import {
  usePushHistory,
  useSetHoveredFrameId,
  useSetShapes,
} from "../../store/editor/selectors";
import { RefObject } from "react";
import { useCanvasRenderer } from "../../context/use-renderer";
import { getBoundingBox } from "../../geometry/bounding-box/get-bounding-box";
import { checkIsInsideFrame, getGroupBounds } from "../selection/use-selection";
import { usePointerState } from "../../pointer/use-pointer-state";
import { FrameShape, Point, Shape } from "../../types";

export default function useShapeMove(
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>,
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const setShapes = useSetShapes();
  const pushHistory = usePushHistory();
  const setHoveredFrameId = useSetHoveredFrameId();

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

    // Start with all top-level shapes
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

  function onPointerUp() {
    const interaction = pointerRefs.interactionRef.current;
    if (interaction.type !== "move") return;

    const movedShapes = new Map(
      interaction.previewShapes.map((shape) => [shape.id, shape]),
    );

    setShapes((prevShapes) => {
      // Apply moved positions.
      const updatedShapes = prevShapes.map((shape) => {
        const moved = movedShapes.get(shape.id);
        return moved ?? shape;
      });

      const frames = updatedShapes.filter(
        (shape): shape is FrameShape => shape.type === "frame",
      );

      const frameIds = new Set(frames.map((frame) => frame.id));

      // Recompute frame membership.
      for (const shape of updatedShapes) {
        // If this shape already belongs to a frame that still exists,
        // and it's not itself a frame, keep its current parent.
        if (
          shape.type !== "frame" &&
          shape.frameId &&
          frameIds.has(shape.frameId)
        ) {
          continue;
        }

        const parentFrame = findContainingFrame(
          shape,
          frames.filter((frame) => frame.id !== shape.id),
        );

        if (!parentFrame) {
          shape.frameId = null;
          continue;
        }

        shape.frameId = parentFrame.id;
      }

      return reorderShapesByFrame(updatedShapes);
    });

    pushHistory();

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
    invalidateScene();
  }

  return {
    moveShapes,
    onPointerUp,
  };
}
