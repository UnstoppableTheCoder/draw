import { getAbsolutePoint } from "../../geometry/get-absolute-point";
import getStrokeStyleValue from "../../components/properties-panel/get-stroke-style-value";
import { FreeDrawShape } from "../../types";

export const drawFreeDraw = (
  ctx: CanvasRenderingContext2D,
  shape: FreeDrawShape,
) => {
  const { x, y, points } = shape;

  const strokeValue = getStrokeStyleValue(shape.strokeStyle ?? "solid");

  ctx.save();
  ctx.setLineDash(strokeValue);
  ctx.lineWidth = shape.strokeWidth ?? 2;
  ctx.strokeStyle = shape.strokeColor ?? "white";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = (shape.opacity ?? 100) / 100;

  // Draw a dot
  if (points.length === 1) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = shape.strokeColor ?? "white";
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
  ctx.restore();
};
