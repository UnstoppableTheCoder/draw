import { EraserPoint } from "../../types/types";

export default function drawEraserBackground({
  ctx,
  eraserPoints,
  scale,
}: {
  ctx: CanvasRenderingContext2D;
  eraserPoints: EraserPoint[];
  scale: number;
}) {
  ctx.lineWidth = 8 / scale;
  ctx.strokeStyle = "#5c5c5c";

  const firstPoint = eraserPoints[0];
  if (!firstPoint) return;

  ctx.beginPath();
  ctx.moveTo(firstPoint.x, firstPoint.y);

  for (let i = 1; i < eraserPoints.length; i++) {
    const point = eraserPoints[i];
    if (!point) continue;

    ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();
}
