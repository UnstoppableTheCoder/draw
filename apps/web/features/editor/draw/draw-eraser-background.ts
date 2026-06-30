import { EraserPoint, Point } from "../types/types";

export default function drawEraserBackground({
  ctx,
  eraserPoints,
  panOffset,
  scale,
  scaleOffset,
}: {
  ctx: CanvasRenderingContext2D;
  eraserPoints: EraserPoint[];
  panOffset: Point;
  scale: number;
  scaleOffset: Point;
}) {
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
