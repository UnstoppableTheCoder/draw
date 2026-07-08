"use client";

import { RefObject, useCallback, useEffect, useRef } from "react";
import { usePointerState } from "../pointer/use-pointer-state";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import { SelectedBounds, Shape } from "../../types/types";
import drawSelectionBounds from "../../draw/selection/bounds";
import { renderShapes } from "../../draw/render-shapes";
import drawLineSelection from "../../draw/selection/line-selection";
import drawEraserBackground from "../../draw/eraser/background";
import { clearCanvas } from "../../draw/clear-canvas";
import { getGroupBounds } from "../interactions/use-selection-actions";
import drawMarqueeSelection from "../../draw/selection/marquee-selection";
import { normalizeRect } from "../../geometry/normalize-rect";
import { getBoundingBox } from "../../geometry/bounding-box/get-bounding-box";
import { useEditorStore } from "../../store/editor/editor-store";
import drawGroupedShapeSelection from "../../draw/selection/grouped-shapes-selection";
import { signalFromNodeResponse } from "next/dist/server/web/spec-extension/adapters/next-request";

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

  const renderShapeSelection = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      shape: Shape,
      bounds: SelectedBounds,
      scale: number,
      selectionType: "child" | "group",
      lineStyle: "solid" | "dashed",
    ) => {
      if (shape.type === "arrow" || shape.type === "line") {
        drawLineSelection(ctx, scale, shape, selectionType, lineStyle);
      } else {
        drawSelectionBounds(ctx, scale, bounds, selectionType, lineStyle);
      }
    },
    [],
  );

  const renderGroupSelection = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      bounds: SelectedBounds,
      scale: number,
      selectionType: "child" | "group" = "child",
      lineStyle: "solid" | "dashed",
    ) => {
      drawSelectionBounds(ctx, scale, bounds, selectionType, lineStyle);
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

    const isTransformInteraction =
      interaction.type === "move" ||
      interaction.type === "resize" ||
      interaction.type === "rotate";

    const skipShapeIds = isTransformInteraction
      ? (() => {
          const selectedFrames = interaction.previewShapes.filter(
            (shape) => shape.type === "frame",
          );

          const selectedFramesIds = new Set(
            selectedFrames.map((shapes) => shapes.id),
          );

          const skippedIds: string[] = [];

          interaction.previewShapes.forEach((shape) =>
            skippedIds.push(shape.id),
          );

          if (interaction.type === "move") {
            interaction.framedPreviewShapes.forEach((framedShape) => {
              if (!framedShape.frameId) return;

              const isSelectedFrameShape = selectedFramesIds.has(
                framedShape.frameId,
              );

              if (isSelectedFrameShape) {
                skippedIds.push(framedShape.id);
              }
            });
          }

          return skippedIds;
        })()
      : textEditingState && textEditingState.id
        ? [textEditingState.id]
        : [];

    renderShapes({
      ctx,
      shapes,
      scale,
      skipShapeIds,
    });

    ctx.restore();
  }, [sceneCanvasRef, pointerRefs, viewportHelpers]);

  const renderOverlay = useCallback(() => {
    if (!overlayCanvasRef) return;

    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) return;

    const interaction = pointerRefs.interactionRef.current;
    const { shapes, selectedShapesIds, scale } = useEditorStore.getState();

    clearCanvas(ctx);

    ctx.save();

    viewportHelpers.applyViewportTransform(ctx);

    // Marquee Selection Box
    const marqueeSelect =
      interaction.type === "selection-box" ? interaction : null;

    if (marqueeSelect) {
      const { startPoint, endPoint } = marqueeSelect;

      const marqueeSelection = {
        type: "selection-box" as const,
        ...normalizeRect(startPoint, endPoint),
      };

      if (marqueeSelection) {
        drawMarqueeSelection(ctx, marqueeSelection, scale);
      }
    }

    // Render Preview Shapes
    const isTransformInteraction =
      interaction.type === "move" ||
      interaction.type === "resize" ||
      interaction.type === "rotate";

    // Preview Shapes
    const previewShapes =
      interaction.type === "draw"
        ? interaction.previewShape
          ? [interaction.previewShape]
          : []
        : isTransformInteraction
          ? interaction.previewShapes
          : [];

    if (previewShapes.length > 0) {
      // Renders the selected preview shapes
      renderShapes({
        ctx,
        shapes: previewShapes,
        scale,
      });

      // Renders the framed preview shapes
      if (interaction.type === "move") {
        renderShapes({ ctx, shapes: interaction.framedPreviewShapes, scale });
      }
    }

    // Eraser Trail
    if (pointerRefs.eraserTrailRef.current.length > 0) {
      drawEraserBackground({
        ctx,
        eraserPoints: pointerRefs.eraserTrailRef.current,
        scale,
      });
    }

    // Group Selection
    if (
      isTransformInteraction ||
      interaction.type === "select" ||
      interaction.type === "selection-box"
    ) {
      if (interaction.groupedShapes) {
        for (const shapes of Object.values(interaction.groupedShapes)) {
          const groupBounds = getGroupBounds(shapes);

          if (!interaction.previewShapes) return;

          const containsOnlyGroupedShapes = interaction.previewShapes.every(
            (shape) => shape.groupId,
          );

          if (
            !containsOnlyGroupedShapes ||
            Object.values(interaction.groupedShapes).length > 1
          ) {
            drawGroupedShapeSelection(ctx, groupBounds, scale);
          }
        }
      }
    }

    // Shape Selection
    const selectionShapes = isTransformInteraction
      ? interaction.previewShapes
      : shapes.filter((shape) => selectedShapesIds.includes(shape.id));

    if (selectionShapes.length === 1) {
      const shape = selectionShapes[0];
      if (!shape) return;

      // if shape belongs to a group return
      if (shape.groupId) return;

      renderShapeSelection(
        ctx,
        shape,
        getBoundingBox(shape),
        scale,
        "group",
        "solid",
      );
    } else if (selectionShapes.length > 1) {
      const bounds = isTransformInteraction
        ? interaction.groupBounds
        : getGroupBounds(selectionShapes);

      selectionShapes.forEach((shape) => {
        // if shape belongs to a group return
        if (shape.groupId) return;

        renderShapeSelection(
          ctx,
          shape,
          getBoundingBox(shape),
          scale,
          "child",
          "solid",
        );
      });

      if (bounds) {
        renderGroupSelection(ctx, bounds, scale, "group", "dashed");
      }
    }

    ctx.restore();
  }, [
    overlayCanvasRef,
    pointerRefs,
    renderShapeSelection,
    renderGroupSelection,
    viewportHelpers,
  ]);

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
