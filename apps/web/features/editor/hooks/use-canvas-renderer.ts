import { RefObject, useEffect } from "react";
import { renderShapes } from "../draw/render-shapes";
import * as store from "../store/selectors";
import drawEraserBackground from "../draw/draw-eraser-background";

export default function useCanvasRenderer(
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
) {
  const shapes = store.useShapes();
  const scale = store.useScale();
  const panOffset = store.usePanOffset();
  const scaleOffset = store.useScaleOffset();
  const selectedShapeBounds = store.useSelectedShapeBounds();
  const selectedShape = store.useSelectedShape();
  const eraserPoints = store.useEraserPoints();
  const textEditingState = store.useTextEditingState();

  // Handles Rendering of Shapes
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    renderShapes(
      textEditingState && textEditingState.id
        ? {
            ctx,
            shapes,
            scale,
            panOffset,
            scaleOffset,
            bounds: selectedShapeBounds,
            selectedShape,
            textEditingState,
          }
        : {
            ctx,
            shapes,
            scale,
            panOffset,
            scaleOffset,
            bounds: selectedShapeBounds,
            selectedShape,
          },
    );
  }, [
    shapes,
    scale,
    panOffset,
    scaleOffset,
    selectedShapeBounds,
    selectedShape,
    eraserPoints,
  ]);

  // Draws Eraser Background
  useEffect(() => {
    drawEraserBackground(ctxRef, eraserPoints);
  }, [eraserPoints]);
}
