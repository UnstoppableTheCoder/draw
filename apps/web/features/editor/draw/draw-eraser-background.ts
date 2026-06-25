import { RefObject } from "react";
import { PointTuple } from "../types/types";

export default function drawEraserBackground(
  ctxRef: RefObject<CanvasRenderingContext2D | null>,
  eraserPoints: PointTuple[],
) {
  const ctx = ctxRef.current;
  if (!ctx) return;

  ctx.lineWidth = 4;
  ctx.strokeStyle = "#5c5c5c";

  const firstPoint = eraserPoints[0];
  if (!firstPoint) return;

  ctx.beginPath();

  ctx.moveTo(firstPoint[0], firstPoint[1]);

  for (let i = 1; i < eraserPoints.length; i++) {
    const point = eraserPoints[i];
    if (!point) continue;

    ctx.lineTo(point[0], point[1]);
  }

  ctx.stroke();
}
