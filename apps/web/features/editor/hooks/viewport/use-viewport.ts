import { RefObject } from "react";
import { usePanOffset, useScale, useScaleOffset } from "../../store/selectors";
import { Point } from "../../types/types";

export default function useViewportHelpers({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const panOffset = usePanOffset();
  const scale = useScale();
  const scaleOffset = useScaleOffset();

  const getScreenToCanvasCoordinates = (
    screenX: number,
    screenY: number,
  ): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    // X, Y -> Screen Coordinates
    const x = screenX - rect.left;
    const y = screenY - rect.top;

    // X, Y -> Canvas Coordinates
    return {
      x: (x - panOffset.x - scaleOffset.x) / scale,
      y: (y - panOffset.y - scaleOffset.y) / scale,
    };
  };

  const getCanvasToScreenCoordinates = (
    canvasX: number,
    canvasY: number,
  ): Point => {
    return {
      x: canvasX * scale + panOffset.x + scaleOffset.x,
      y: canvasY * scale + panOffset.y + scaleOffset.y,
    };
  };

  return { getCanvasToScreenCoordinates, getScreenToCanvasCoordinates };
}
