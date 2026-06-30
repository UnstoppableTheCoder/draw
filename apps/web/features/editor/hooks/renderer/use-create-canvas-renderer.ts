"use client";

import { RefObject, useCallback, useEffect, useRef } from "react";
import { usePointerState } from "../pointer/use-pointer-state";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import { SelectedShapeBounds, Shape } from "../../types/types";
import drawLineSelection from "../../draw/draw-line-selection";
import drawSelectionBounds from "../../draw/draw-selection-bounds";
import { useEditorStore } from "../../store/editor-store";
import { clearCanvas } from "../../draw/clear-canvas";
import { renderShapes } from "../../draw/render-shapes";
import drawEraserBackground from "../../draw/draw-eraser-background";
import { getBoundingBox } from "../../geometry/bounding-box";

export default function useCreateCanvasRenderer({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
}: {
  sceneCanvasRef?: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef?: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
}) {
  const frameIdRef = useRef<number | null>(null);
  const sceneDirtyRef = useRef(false);
  const overlayDirtyRef = useRef(false);

  const viewportHelpers = useViewportHelpers();

  const renderSelection = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      shape: Shape,
      bounds: SelectedShapeBounds,
      scale: number,
    ) => {
      if (shape.type === "arrow" || shape.type === "line") {
        drawLineSelection(ctx, scale, shape);
      } else {
        drawSelectionBounds(ctx, scale, bounds);
      }
    },
    [],
  );

  const renderScene = useCallback(() => {
    if (!sceneCanvasRef) return;
    const ctx = sceneCanvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { shapes, textEditingState, scale, panOffset, scaleOffset } =
      useEditorStore.getState();

    const interaction = pointerRefs.interactionRef.current;

    clearCanvas(ctx);

    ctx.save();

    viewportHelpers.applyViewportTransform(ctx);
    console.log("scene: ===> ");
    console.log({
      scale,
      panOffset,
      scaleOffset,
    });

    let skipShapeId: string | undefined;

    switch (interaction.type) {
      case "move":
      case "resize":
      case "rotate":
        skipShapeId = interaction.activeShapeId;
        break;

      default:
        skipShapeId = textEditingState?.id;
    }

    console.log("scene shapes rendering");

    renderShapes({
      ctx,
      shapes,
      skipShapeId,
    });

    ctx.restore();
  }, [sceneCanvasRef, pointerRefs, viewportHelpers]);

  const renderOverlay = useCallback(() => {
    if (!overlayCanvasRef) return;
    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) return;

    const interaction = pointerRefs.interactionRef.current;

    const { selectedShape, scale, panOffset, scaleOffset } =
      useEditorStore.getState();

    clearCanvas(ctx);

    ctx.save();
    viewportHelpers.applyViewportTransform(ctx);
    console.log("overlay: ===> ");
    console.log({
      scale,
      panOffset,
      scaleOffset,
    });

    const isTransformInteraction =
      interaction.type === "move" ||
      interaction.type === "resize" ||
      interaction.type === "rotate";

    const previewShape =
      interaction.type === "draw" || isTransformInteraction
        ? interaction.previewShape
        : null;

    if (previewShape) {
      console.log("overlay shapes rendering");
      renderShapes({
        ctx,
        shapes: [previewShape],
      });
    }

    if (pointerRefs.eraserTrailRef.current.length > 0) {
      drawEraserBackground({
        ctx,
        eraserPoints: pointerRefs.eraserTrailRef.current,
        panOffset,
        scale,
        scaleOffset,
      });
    }

    const selectionShape = isTransformInteraction
      ? previewShape
      : selectedShape;

    const selectionBounds = isTransformInteraction
      ? interaction.bounds
      : selectionShape
        ? getBoundingBox(selectionShape)
        : null;

    if (selectionShape && selectionBounds) {
      renderSelection(ctx, selectionShape, selectionBounds, scale);
    }

    ctx.restore();
  }, [overlayCanvasRef, pointerRefs, renderSelection, viewportHelpers]);

  const flushRender = useCallback(() => {
    frameIdRef.current = null;

    if (sceneDirtyRef.current) {
      sceneDirtyRef.current = false;
      renderScene();
    }

    if (overlayDirtyRef.current) {
      overlayDirtyRef.current = false;
      renderOverlay();
    }
  }, [renderScene, renderOverlay]);

  const scheduleRender = useCallback(() => {
    if (frameIdRef.current !== null) return;

    frameIdRef.current = requestAnimationFrame(flushRender);
  }, [flushRender]);

  const invalidateScene = useCallback(() => {
    sceneDirtyRef.current = true;
    scheduleRender();
  }, [scheduleRender]);

  const invalidateOverlay = useCallback(() => {
    overlayDirtyRef.current = true;
    scheduleRender();
  }, [scheduleRender]);

  const invalidate = useCallback(() => {
    sceneDirtyRef.current = true;
    overlayDirtyRef.current = true;
    scheduleRender();
  }, [scheduleRender]);

  useEffect(() => {
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, []);

  return {
    renderScene,
    renderOverlay,

    invalidate,
    invalidateScene,
    invalidateOverlay,
  };
}
