import { RefObject } from "react";
import { Point, PointTuple } from "../types/types";

export default function drawEraserBackground({
  ctxRef,
  eraserPoints,
  panOffset,
  scale,
  scaleOffset,
}: {
  ctxRef: RefObject<CanvasRenderingContext2D | null>;
  eraserPoints: PointTuple[];
  panOffset: Point;
  scale: number;
  scaleOffset: Point;
}) {
  const ctx = ctxRef.current;
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
  ctx.moveTo(firstPoint[0], firstPoint[1]);

  for (let i = 1; i < eraserPoints.length; i++) {
    const point = eraserPoints[i];
    if (!point) continue;

    ctx.lineTo(point[0], point[1]);
  }

  ctx.stroke();
  ctx.restore();
}
