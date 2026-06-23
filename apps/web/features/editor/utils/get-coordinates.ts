import { MouseEvent, PointerEvent } from "react";

type Point = {
  x: number;
  y: number;
};

type Props = {
  screenX: number;
  screenY: number;
  canvas: HTMLCanvasElement;
  panOffset: Point;
  scale: number;
  scaleOffset: Point;
};

export const getScreenToCanvasCoordinates = ({
  screenX,
  screenY,
  canvas,
  panOffset,
  scale,
  scaleOffset,
}: Props) => {
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

export const getCanvasToScreenCoordinates = ({
  canvasX,
  canvasY,
  panOffset,
  scale,
  scaleOffset,
}: {
  canvasX: number;
  canvasY: number;
  panOffset: Point;
  scale: number;
  scaleOffset: Point;
}) => {
  return {
    x: canvasX * scale + panOffset.x + scaleOffset.x,
    y: canvasY * scale + panOffset.y + scaleOffset.y,
  };
};
