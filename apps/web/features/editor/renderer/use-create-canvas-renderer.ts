"use client";

import { useCallback, useEffect, useRef } from "react";
import useViewportHelpers from "../interactions/viewport/use-viewport-helpers";
import { SelectedBounds, Shape } from "../types/types";
import { useEditorStore } from "../store/editor/editor-store";
import { normalizeRect } from "../geometry/normalize-rect";
import { getGroupBounds } from "../geometry/bounding-box/get-group-bounds";
import { getBoundingBox } from "../geometry/bounding-box/get-bounding-box";
import drawLineSelection from "../drawing/selection/line-selection";
import drawSelectionBounds from "../drawing/selection/bounds";
import { clearCanvas } from "../drawing/clear-canvas";
import { renderShapes } from "../drawing/render-shapes";
import drawMarqueeSelection from "../drawing/selection/marquee-selection";
import drawEraserBackground from "../drawing/eraser/background";
import drawGroupedShapeSelection from "../drawing/selection/grouped-shapes-selection";
import { EditorRefs } from "@/types";
import drawGrid from "../drawing/background/draw-line-grid";
import drawDotGrid from "../drawing/background/draw-dot-grid";
import drawLineGrid from "../drawing/background/draw-line-grid";

export default function useCreateCanvasRenderer({
  backgroundCanvasRef,
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
}: EditorRefs) {
  const frameIdRef = useRef<number | null>(null);
  const backgroundDirtyRef = useRef(false);
  const sceneDirtyRef = useRef(false);
  const overlayDirtyRef = useRef(false);

  const viewportHelpers = useViewportHelpers();

  // Grouped Shapes
  const getGroupedShapes = (previewShapes: Shape[]) => {
    const map = new Map<string, Shape[]>();

    for (const shape of previewShapes) {
      if (!shape.groupId) continue;

      if (!map.has(shape.groupId)) {
        map.set(shape.groupId, []);
      }

      map.get(shape.groupId)!.push(shape);
    }

    return map;
  };

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

  const renderBackground = useCallback(() => {
    if (!backgroundCanvasRef.current) return;
    const canvas = backgroundCanvasRef.current;

    const { scale } = useEditorStore.getState();

    const ctx = backgroundCanvasRef.current?.getContext("2d");
    if (!ctx) return;

    clearCanvas(ctx);

    const topLeft = viewportHelpers.screenToCanvas({
      x: 0,
      y: 0,
    });

    const bottomRight = viewportHelpers.screenToCanvas({
      x: canvas.width,
      y: canvas.height,
    });

    ctx.save();

    try {
      viewportHelpers.applyViewportTransform(ctx);

      // drawLineGrid({
      //   ctx,
      //   topLeft,
      //   bottomRight,
      //   scale,
      // });

      drawDotGrid({
        ctx,
        topLeft,
        bottomRight,
        scale,
      });
    } finally {
      ctx.restore();
    }
  }, [backgroundCanvasRef, viewportHelpers]);

  const renderScene = useCallback(() => {
    if (!sceneCanvasRef) return;

    const ctx = sceneCanvasRef.current?.getContext("2d");
    if (!ctx) return;

    const {
      shapes,
      textEditingState,
      scale,
      hoveredFrameId,
      frameEditingState,
    } = useEditorStore.getState();

    const interaction = pointerRefs.interactionRef.current;

    clearCanvas(ctx);

    ctx.save();

    viewportHelpers.applyViewportTransform(ctx);

    const isTransformInteraction =
      interaction.type === "move" ||
      interaction.type === "resize" ||
      interaction.type === "rotate";

    const skipShapeIds = isTransformInteraction
      ? new Set(interaction.previewShapes.map((shape) => shape.id))
      : textEditingState?.id
        ? new Set([textEditingState.id])
        : new Set<string>();

    renderShapes({
      ctx,
      shapes,
      scale,
      skipShapeIds,
      hoveredFrameId,
      frameEditingState,
    });

    ctx.restore();
  }, [sceneCanvasRef, pointerRefs, viewportHelpers]);

  const renderOverlay = useCallback(() => {
    if (!overlayCanvasRef) return;

    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) return;

    const interaction = pointerRefs.interactionRef.current;
    const { shapes, selectedShapesIds, scale, frameEditingState } =
      useEditorStore.getState();

    clearCanvas(ctx);

    ctx.save();

    try {
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
        renderShapes({
          ctx,
          shapes: previewShapes,
          scale,
          frameEditingState,
        });
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
        const previewShapes = interaction.previewShapes;
        if (!previewShapes) return;

        const groupedShapes = getGroupedShapes(previewShapes);

        for (const groupShapes of groupedShapes.values()) {
          const groupBounds = getGroupBounds(groupShapes);
          if (!groupBounds) continue;

          // Draw when other shapes are also selected along with the group
          if (groupShapes.length !== selectedShapesIds.length) {
            drawGroupedShapeSelection(ctx, groupBounds, scale);
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
        const bounds = getGroupBounds(selectionShapes);

        selectionShapes.forEach((shape) => {
          // if shape belongs to a group or frame -> return
          if (shape.groupId || shape.frameId) return;

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
    } finally {
      ctx.restore();
    }
  }, [
    overlayCanvasRef,
    pointerRefs,
    renderShapeSelection,
    renderGroupSelection,
    viewportHelpers,
  ]);

  const flushRender = useCallback(() => {
    frameIdRef.current = null;

    if (backgroundDirtyRef.current) {
      backgroundDirtyRef.current = false;
      renderBackground();
    }

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

  const invalidateBackground = useCallback(() => {
    backgroundDirtyRef.current = true;
    scheduleRender();
  }, [scheduleRender]);

  const invalidateScene = useCallback(() => {
    sceneDirtyRef.current = true;
    scheduleRender();
  }, [scheduleRender]);

  const invalidateOverlay = useCallback(() => {
    overlayDirtyRef.current = true;
    scheduleRender();
  }, [scheduleRender]);

  const invalidate = useCallback(() => {
    backgroundDirtyRef.current = true;
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
    invalidate,
    invalidateBackground,
    invalidateScene,
    invalidateOverlay,
  };
}
