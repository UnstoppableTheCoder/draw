import { Point } from "../../types/types";
import { usePointerState } from "../pointer/use-pointer-state";
import { RefObject } from "react";
import { usePushHistory, useSetShapes } from "../../store/editor/selectors";
import { getResizeRect } from "../../transform/get-resize-rect";
import { resizeFreeDrawShape } from "../../transform/resize-freedraw";
import resizeTextShape from "../../transform/resize-text";
import { resizeLineShape } from "../../transform/resize-line";
import {
  getScaledShapeRect,
  getShapeBounds,
  scalePointInGroup,
} from "../../transform/scale-shape-in-group";
import { useCanvasRenderer } from "../../context/use-renderer";
import { getGroupBounds } from "./use-selection-actions";

function isLineEndpointHandle(
  handle: string | null,
): handle is "start" | "end" {
  return handle === "start" || handle === "end";
}

export default function useShapeResize(
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const pushHistory = usePushHistory();
  const setShapes = useSetShapes();

  const { invalidateOverlay, invalidateScene } = useCanvasRenderer();

  const resizeShapes = (currentPoint: Point) => {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "resize") {
      return;
    }

    const {
      previewShapes,
      initialShapes,
      handle,
      initialGroupBounds,
      initialFontSizes,
      freeDrawPoints,
      lineResizeStates,
    } = interaction;

    const rect = getResizeRect({
      handle,
      currentPoint,
      initialBounds: initialGroupBounds,
    });

    const isGroupSelection = previewShapes.length > 1;
    const initialShapeMap = new Map(
      initialShapes.map((shape) => [shape.id, shape]),
    );

    const ctx = overlayCanvasRef.current?.getContext("2d");

    const updatedShapes = previewShapes.map((shape) => {
      const initialShape = initialShapeMap.get(shape.id);
      if (!initialShape) return shape;

      switch (shape.type) {
        case "line":
        case "arrow": {
          const lineState = lineResizeStates?.[shape.id];
          if (!lineState) return shape;

          if (isLineEndpointHandle(handle)) {
            return resizeLineShape({
              shape,
              currentPoint,
              handle,
              lineResizeState: lineState,
            });
          }

          if (!rect) return shape;
          const start = scalePointInGroup(
            lineState.start,
            initialGroupBounds,
            rect,
          );

          const end = scalePointInGroup(
            lineState.end,
            initialGroupBounds,
            rect,
          );

          return {
            ...shape,
            x: start.x,
            y: start.y,
            points: [
              [0, 0],
              [end.x - start.x, end.y - start.y],
            ] as const,
          } as typeof shape;
        }

        case "freedraw": {
          const points = freeDrawPoints?.[shape.id];
          if (!points || !rect) return shape;

          return resizeFreeDrawShape({
            shape,
            rect,
            initialGroupBounds,
            freeDrawPoints: points,
          });
        }

        case "text": {
          const fontSize = initialFontSizes?.[shape.id];

          if (fontSize == null || !ctx) return shape;

          if (!rect) return shape;
          const shapeRect = isGroupSelection
            ? getScaledShapeRect(initialShape, initialGroupBounds, rect)
            : rect;

          return resizeTextShape({
            ctx,
            shape,
            rect: shapeRect,
            initialBounds: isGroupSelection
              ? getShapeBounds(initialShape)
              : initialGroupBounds,
            initialFontSize: fontSize,
          });
        }

        default:
          if (!rect) return shape;
          const shapeRect = isGroupSelection
            ? getScaledShapeRect(initialShape, initialGroupBounds, rect)
            : rect;

          return {
            ...shape,
            ...shapeRect,
          };
      }
    });

    pointerRefs.interactionRef.current = {
      ...interaction,
      previewShapes: updatedShapes,
      groupBounds: getGroupBounds(updatedShapes)!,
    };

    invalidateOverlay();
  };

  const onPointerUp = () => {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "resize") return;

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
  };

  return {
    resizeShapes,
    onPointerUp,
  };
}
