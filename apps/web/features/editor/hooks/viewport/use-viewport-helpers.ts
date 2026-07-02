import { RefObject, useCallback } from "react";
import { Point } from "../../types/types";
import { useEditorStore } from "../../store/editor/editor-store";

export default function useViewportHelpers(
  canvasRef?: RefObject<HTMLCanvasElement | null>,
) {
  const canvasToScreen = useCallback(({ x, y }: Point): Point => {
    const { scale, panOffset, scaleOffset } = useEditorStore.getState();

    return {
      x: x * scale + panOffset.x + scaleOffset.x,
      y: y * scale + panOffset.y + scaleOffset.y,
    };
  }, []);

  const screenToCanvas = useCallback(({ x, y }: Point): Point => {
    const { scale, panOffset, scaleOffset } = useEditorStore.getState();

    return {
      x: (x - panOffset.x - scaleOffset.x) / scale,
      y: (y - panOffset.y - scaleOffset.y) / scale,
    };
  }, []);

  const clientToCanvas = useCallback(
    (clientX: number, clientY: number): Point | null => {
      const canvas = canvasRef?.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();

      return screenToCanvas({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    },
    [canvasRef, screenToCanvas],
  );

  const canvasToClient = useCallback(
    (clientX: number, clientY: number): Point | null => {
      const canvas = canvasRef?.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();

      const screenPoint = canvasToScreen({ x: clientX, y: clientY });

      return {
        x: screenPoint.x + rect.left,
        y: screenPoint.y + rect.top,
      };
    },
    [canvasRef, canvasToScreen],
  );

  const applyViewportTransform = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { scale, panOffset, scaleOffset } = useEditorStore.getState();
      ctx.translate(panOffset.x + scaleOffset.x, panOffset.y + scaleOffset.y);

      ctx.scale(scale, scale);
    },
    [],
  );

  return {
    canvasToScreen,
    screenToCanvas,
    clientToCanvas,
    canvasToClient,
    applyViewportTransform,
  };
}
