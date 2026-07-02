import { Point } from "../../types/types";
import { usePointerState } from "../pointer/use-pointer-state";
import { usePushHistory, useSetShapes } from "../../store/editor/selectors";
import { RefObject } from "react";
import { useCanvasRenderer } from "../../context/use-renderer";
import { getGroupBounds } from "./use-shape-selection";

export default function useShapeMove(
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>,
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const setShapes = useSetShapes();
  const pushHistory = usePushHistory();

  const { invalidate, invalidateScene } = useCanvasRenderer();

  function moveShapes(currentPoint: Point) {
    const interaction = pointerRefs.interactionRef.current;
    if (interaction.type !== "move") {
      return;
    }

    const updatedShapes = interaction.previewShapes.map((shape) => {
      const dragOffset = interaction.dragOffsets[shape.id];

      if (!dragOffset) return shape;

      return {
        ...shape,
        x: currentPoint.x - dragOffset.x,
        y: currentPoint.y - dragOffset.y,
      };
    });

    pointerRefs.interactionRef.current = {
      ...interaction,
      previewShapes: updatedShapes,
      groupBounds: getGroupBounds(updatedShapes)!,
    };

    invalidate();
  }

  function onPointerUp() {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "move") return;

    pushHistory();

    const previewMap = new Map(
      interaction.previewShapes.map((shape) => [shape.id, shape]),
    );

    setShapes((prev) => prev.map((shape) => previewMap.get(shape.id) ?? shape));

    pointerRefs.interactionRef.current = {
      type: "select",
      previewShapes: interaction.previewShapes,
      groupBounds: interaction.groupBounds,
    };

    invalidateScene();
  }

  return {
    moveShapes,
    onPointerUp,
  };
}

// Todo: Do it later
// const dx = currentPoint.x - interaction.initialPointer.x;
// const dy = currentPoint.y - interaction.initialPointer.y;

// const updatedShapes = interaction.initialShapes.map((shape) => ({
//   ...shape,
//   x: shape.x + dx,
//   y: shape.y + dy,
// }));
