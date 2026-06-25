import { RefObject, useEffect, useRef } from "react";
import { renderShapes } from "../draw/render-shapes";
import * as store from "../store/selectors";

export default function useCanvasContext(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const shapes = store.useShapes();
  const scale = store.useScale();
  const panOffset = store.usePanOffset();
  const scaleOffset = store.useScaleOffset();
  const selectedShapeBounds = store.useSelectedShapeBounds();
  const selectedShape = store.useSelectedShape();

  // Handles Context Creation
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");
    if (!canvasContext) return;

    ctxRef.current = canvasContext;
  }, [canvasRef]);

  // Handles Rendering of Shapes
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    renderShapes({
      ctx,
      shapes,
      scale,
      panOffset,
      scaleOffset,
      bounds: selectedShapeBounds,
      selectedShape,
    });

    // ctx.restore();
  }, [
    shapes,
    scale,
    panOffset,
    scaleOffset,
    selectedShapeBounds,
    selectedShape,
  ]);

  return { ctxRef };
}
