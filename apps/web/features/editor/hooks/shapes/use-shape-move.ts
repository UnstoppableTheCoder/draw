import { Point } from "../../types/types";
import { usePointerState } from "../pointer/use-pointer-state";

export default function useShapeMove(
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  function moveShape(currentPoint: Point) {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "move") return;

    interaction.previewShape = {
      ...interaction.previewShape,
      x: currentPoint.x - interaction.dragOffset.x,
      y: currentPoint.y - interaction.dragOffset.y,
    };
  }

  return {
    moveShape,
  };
}
