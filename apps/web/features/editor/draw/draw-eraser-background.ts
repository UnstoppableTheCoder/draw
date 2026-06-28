import { RefObject } from "react";
import { EraserPoint, Point } from "../types/types";

export default function drawEraserBackground({
  overlayCanvasRef,
  eraserPoints,
  panOffset,
  scale,
  scaleOffset,
}: {
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  eraserPoints: EraserPoint[];
  panOffset: Point;
  scale: number;
  scaleOffset: Point;
}) {
  const ctx = overlayCanvasRef.current?.getContext("2d");
  if (!ctx) return;

  ctx.lineWidth = 8 / scale;
  ctx.strokeStyle = "#5c5c5c";

  const firstPoint = eraserPoints[0];
  if (!firstPoint) return;

  ctx.save();
  ctx.translate(panOffset.x, panOffset.y);
  ctx.translate(scaleOffset.x, scaleOffset.y);
  ctx.scale(scale, scale);

  ctx.beginPath();
  ctx.moveTo(firstPoint.x, firstPoint.y);

  for (let i = 1; i < eraserPoints.length; i++) {
    const point = eraserPoints[i];
    if (!point) continue;

    ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();
  ctx.restore();
}
