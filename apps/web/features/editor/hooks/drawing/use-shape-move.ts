import { Point } from "../../types/types";
import { usePointerState } from "../pointer/use-pointer-state";
import {
  usePushHistory,
  useSetSelectedShape,
  useSetShapes,
} from "../../store/selectors";
import { RefObject } from "react";
import { getBoundingBox } from "../../geometry/bounding-box";
import { useCanvasRenderer } from "../../renderer/use-renderer";

export default function useShapeMove(
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>,
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const setShapes = useSetShapes();
  const setSelectedShape = useSetSelectedShape();
  const pushHistory = usePushHistory();
  const { invalidate, invalidateOverlay, invalidateScene } =
    useCanvasRenderer();

  function moveShape(currentPoint: Point) {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "move" || !interaction.previewShape) {
      return;
    }

    interaction.previewShape = {
      ...interaction.previewShape,
      x: currentPoint.x - interaction.dragOffset.x,
      y: currentPoint.y - interaction.dragOffset.y,
    };
    interaction.bounds = getBoundingBox(interaction.previewShape);

    invalidate();
  }

  function onPointerUp() {
    const interaction = pointerRefs.interactionRef.current;
    if (interaction.type !== "move") return;

    pushHistory();

    setShapes((prev) =>
      prev.map((shape) => {
        if (!interaction.previewShape) return shape;
        return shape.id === interaction.previewShape.id
          ? interaction.previewShape
          : shape;
      }),
    );

    setSelectedShape(interaction.previewShape);
  }

  return {
    moveShape,
    onPointerUp,
  };
}
