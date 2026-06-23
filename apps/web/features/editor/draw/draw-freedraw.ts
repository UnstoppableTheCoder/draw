import { FreeDrawShape } from "../types/types";
import { getAbsolutePoint } from "../utils/get-absolute-point";

export const drawFreeDraw = (
  ctx: CanvasRenderingContext2D,
  shape: FreeDrawShape,
) => {
  const { x, y, points } = shape;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Draw a dot
  if (points.length === 1) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    return;
  }

  const firstPoint = points[0];
  if (!firstPoint) return;
  const first = getAbsolutePoint(x, y, firstPoint);

  ctx.beginPath();

  ctx.moveTo(first.x, first.y);

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (!point) continue;

    const absolutePoint = getAbsolutePoint(x, y, point);

    ctx.lineTo(absolutePoint.x, absolutePoint.y);
  }

  ctx.stroke();
};
