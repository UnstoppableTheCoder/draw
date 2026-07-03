import { LineShape } from "@/features/editor/types/types";
import { getAbsolutePoint } from "../../geometry/get-absolute-point";

export const drawLine = (ctx: CanvasRenderingContext2D, shape: LineShape) => {
  const { x, y, points } = shape;

  if (points.length < 2) return;

  ctx.lineWidth = 2;
  ctx.strokeStyle = shape.strokeColor ?? "white";

  const first = points[0];
  if (!first) return;

  const absoluteFirst = getAbsolutePoint(x, y, first);

  ctx.beginPath();

  ctx.moveTo(absoluteFirst.x, absoluteFirst.y);

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (!point) continue;

    const absolutePoint = getAbsolutePoint(x, y, point);
    ctx.lineTo(absolutePoint.x, absolutePoint.y);
  }

  ctx.stroke();
};
