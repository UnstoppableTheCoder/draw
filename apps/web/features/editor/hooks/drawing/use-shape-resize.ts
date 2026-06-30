import { Point, Shape } from "../../types/types";
import { resizeFreeDrawShape } from "../../resize/resize-freedraw";
import { usePointerState } from "../pointer/use-pointer-state";
import resizeTextShape from "../../resize/resize-text";
import { RefObject } from "react";
import { getBoundingBox } from "../../geometry/bounding-box";
import { getResizeRect } from "../../resize/get-resize-rect";
import { resizeLineShape } from "../../resize/resize-line";
import {
  usePushHistory,
  useSetSelectedShape,
  useSetShapes,
} from "../../store/selectors";
import { useCanvasRenderer } from "../../renderer/use-renderer";

export default function useShapeResize(
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const setShapes = useSetShapes();
  const setSelectedShape = useSetSelectedShape();
  const pushHistory = usePushHistory();
  const { invalidate, invalidateOverlay, invalidateScene } =
    useCanvasRenderer();

  const resizeShape = (currentPoint: Point) => {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "resize" || !interaction.previewShape) {
      return;
    }

    const {
      previewShape,
      handle,
      initialBounds,
      initialFontSize,
      freeDrawPoints,
      lineResizeState,
    } = interaction;

    const updatePreviewShape = (shape: Shape) => {
      interaction.previewShape = shape;
      interaction.bounds = getBoundingBox(shape);
      invalidateOverlay();
    };

    if (previewShape.type === "arrow" || previewShape.type === "line") {
      if (!lineResizeState) {
        return;
      }

      const updatedShape = resizeLineShape({
        shape: previewShape,
        currentPoint,
        handle,
        lineResizeState,
      });

      updatePreviewShape(updatedShape);
      return;
    }

    // Other Shapes
    const rect = getResizeRect({
      handle,
      currentPoint,
      initialBounds,
    });
    if (!rect) return;

    if (previewShape.type === "freedraw") {
      if (!freeDrawPoints) return;

      const updatedShape = resizeFreeDrawShape({
        shape: previewShape,
        rect,
        initialBounds,
        freeDrawPoints,
      });

      updatePreviewShape(updatedShape);
      return;
    }

    if (previewShape.type === "text") {
      if (initialFontSize == null) return;

      const ctx = overlayCanvasRef.current?.getContext("2d");
      if (!ctx) return;

      const updatedShape = resizeTextShape({
        ctx,
        shape: previewShape,
        rect,
        initialBounds,
        initialFontSize,
      });

      updatePreviewShape(updatedShape);
      return;
    }

    const updatedShape = {
      ...previewShape,
      ...rect,
    };

    updatePreviewShape(updatedShape);
  };

  const onPointerUp = () => {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "resize") return;

    const { previewShape } = interaction;
    if (!previewShape) return;

    pushHistory();

    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === previewShape.id ? previewShape : shape,
      ),
    );

    setSelectedShape(previewShape);

    pointerRefs.interactionRef.current = {
      type: "select",
      activeShapeId: previewShape.id,
      previewShape: previewShape,
      bounds: getBoundingBox(previewShape),
    };
  };

  return {
    resizeShape,
    onPointerUp,
  };
}
