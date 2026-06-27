import { RefObject } from "react";

type Point = {
  x: number;
  y: number;
};

export default function useViewportHelpers({
  canvasRef,
  panOffset,
  scale,
  scaleOffset,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  panOffset: Point;
  scale: number;
  scaleOffset: Point;
}) {
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
