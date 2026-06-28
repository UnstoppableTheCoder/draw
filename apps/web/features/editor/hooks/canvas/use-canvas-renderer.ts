import { RefObject, useCallback, useEffect } from "react";
import { clearCanvas } from "../../draw/clear-canvas";
import { renderShapes } from "../../draw/render-shapes";
import drawSelectionBounds from "../../draw/draw-selection-bounds";
import drawLineSelection from "../../draw/draw-line-selection";
import * as store from "../../store/selectors";
import { usePointerState } from "../pointer/use-pointer-state";
import { SelectedShapeBounds, Shape } from "../../types/types";

export default function useCanvasRenderer(
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const shapes = store.useShapes();
  const scale = store.useScale();
  const panOffset = store.usePanOffset();
  const scaleOffset = store.useScaleOffset();

  const applyViewportTransform = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.translate(panOffset.x, panOffset.y);
      ctx.translate(scaleOffset.x, scaleOffset.y);
      ctx.scale(scale, scale);
    },
    [panOffset, scaleOffset, scale],
  );

  const renderSelection = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      shape: Shape,
      bounds: SelectedShapeBounds,
    ) => {
      if (shape.type === "arrow" || shape.type === "line") {
        drawLineSelection(ctx, scale, shape);
      } else {
        drawSelectionBounds(ctx, scale, bounds);
      }
    },
    [scale],
  );

  const renderScene = useCallback(
    (sceneCanvasRef: RefObject<HTMLCanvasElement | null>) => {
      const ctx = sceneCanvasRef.current?.getContext("2d");
      if (!ctx) return;

      const interaction = pointerRefs.interactionRef.current;

      clearCanvas(ctx);

      ctx.save();

      applyViewportTransform(ctx);

      const skipShapeId =
        interaction.type === "move" || interaction.type === "resize"
          ? interaction.activeShapeId
          : undefined;

      renderShapes({
        ctx,
        shapes,
        skipShapeId,
      });

      ctx.restore();
    },
    [shapes, applyViewportTransform, pointerRefs],
  );

  const renderOverlay = useCallback(
    (overlayCanvasRef: RefObject<HTMLCanvasElement | null>) => {
      const ctx = overlayCanvasRef.current?.getContext("2d");
      if (!ctx) return;

      const interaction = pointerRefs.interactionRef.current;

      clearCanvas(ctx);

      ctx.save();

      applyViewportTransform(ctx);

      const isPreviewInteraction =
        interaction.type === "draw" ||
        interaction.type === "move" ||
        interaction.type === "resize" ||
        interaction.type === "rotate";

      const previewShape = isPreviewInteraction
        ? interaction.previewShape
        : null;

      if (previewShape) {
        renderShapes({
          ctx,
          shapes: [previewShape],
          skipShapeId: undefined,
        });
      }

      if (
        interaction.type === "move" ||
        interaction.type === "resize" ||
        interaction.type === "rotate"
      ) {
        const shape = previewShape;
        const bounds = interaction.bounds;

        if (shape && bounds) {
          renderSelection(ctx, shape, bounds);
        }
      }

      ctx.restore();
    },
    [pointerRefs, applyViewportTransform, renderSelection],
  );

  const clearOverlay = useCallback(
    (overlayCanvasRef: RefObject<HTMLCanvasElement | null>) => {
      const ctx = overlayCanvasRef.current?.getContext("2d");
      if (!ctx) return;

      clearCanvas(ctx);
    },
    [],
  );

  return {
    renderScene,
    renderOverlay,
    clearOverlay,
  };
}
