import { Point, Shape } from "../../types/types";
import { TOLERANCE } from "../../constants/canvas";
import { normalizeRect } from "../../utils/normalize-rect";
import { resizeFreeDrawShape } from "../../resize/resize-freedraw";
import { usePointerState } from "../pointer/use-pointer-state";
import resizeTextShape from "../../resize/resize-text";
import { RefObject } from "react";
import useCanvasRenderer from "../canvas/use-canvas-renderer";

export default function useShapeResize(
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>,
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const renderer = useCanvasRenderer(pointerRefs);

  const resizeShape = (currentPoint: Point) => {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "resize") {
      return;
    }

    const {
      previewShape,
      handle,
      bounds,
      initialBounds,
      initialFontSize,
      freeDrawPoints,
      lineResizeState,
    } = interaction;

    if (previewShape.type === "arrow" || previewShape.type === "line") {
      if (!handle || !lineResizeState) {
        return;
      }

      let updatedShape: Shape = {
        ...previewShape,
      };

      switch (handle) {
        case "start": {
          const fixedEnd = lineResizeState.end;

          updatedShape = {
            ...previewShape,
            x: currentPoint.x,
            y: currentPoint.y,
            points: [
              [0, 0],
              [fixedEnd.x - currentPoint.x, fixedEnd.y - currentPoint.y],
            ],
          };
          break;
        }

        case "end": {
          const fixedStart = lineResizeState.start;

          updatedShape = {
            ...previewShape,
            x: fixedStart.x,
            y: fixedStart.y,
            points: [
              [0, 0],
              [currentPoint.x - fixedStart.x, currentPoint.y - fixedStart.y],
            ],
          };
          break;
        }
      }

      interaction.previewShape = updatedShape;
      renderer.renderOverlay(overlayCanvasRef);
      return;
    }

    // Other Shapes
    let { minX, minY, maxX, maxY } = initialBounds;

    minX = minX + TOLERANCE;
    minY = minY + TOLERANCE;
    maxX = maxX - TOLERANCE;
    maxY = maxY - TOLERANCE;

    let start: Point;
    let end: Point;

    switch (handle) {
      case "top":
        start = {
          x: minX,
          y: currentPoint.y,
        };

        end = {
          x: maxX,
          y: maxY,
        };
        break;

      case "bottom":
        start = {
          x: minX,
          y: minY,
        };

        end = {
          x: maxX,
          y: currentPoint.y,
        };
        break;

      case "left":
        start = {
          x: currentPoint.x,
          y: minY,
        };

        end = {
          x: maxX,
          y: maxY,
        };
        break;

      case "right":
        start = {
          x: minX,
          y: minY,
        };

        end = {
          x: currentPoint.x,
          y: maxY,
        };
        break;

      case "top-left":
        start = currentPoint;

        end = {
          x: maxX,
          y: maxY,
        };
        break;

      case "top-right":
        start = {
          x: minX,
          y: currentPoint.y,
        };

        end = {
          x: currentPoint.x,
          y: maxY,
        };
        break;

      case "bottom-left":
        start = {
          x: currentPoint.x,
          y: minY,
        };

        end = {
          x: maxX,
          y: currentPoint.y,
        };
        break;

      case "bottom-right":
        start = {
          x: minX,
          y: minY,
        };

        end = currentPoint;
        break;

      default:
        return;
    }

    const rect = normalizeRect(start, end);

    if (previewShape.type === "freedraw") {
      if (!freeDrawPoints) return;

      const updatedShape = resizeFreeDrawShape({
        shape: previewShape,
        rect,
        initialBounds,
        freeDrawPoints,
      });
      if (!updatedShape) return;

      interaction.previewShape = updatedShape;

      renderer.renderOverlay(overlayCanvasRef);
      return;
    }

    if (previewShape.type === "text") {
      if (initialFontSize == null) return;

      const updatedShape = resizeTextShape({
        canvasRef: overlayCanvasRef,
        shape: previewShape,
        rect,
        initialBounds,
        initialFontSize,
      });

      interaction.previewShape = updatedShape;
      renderer.renderOverlay(overlayCanvasRef);
      return;
    }

    const updatedShape = {
      ...previewShape,
      ...rect,
    };

    interaction.previewShape = updatedShape;
    renderer.renderOverlay(overlayCanvasRef);
  };

  return {
    resizeShape,
  };
}
