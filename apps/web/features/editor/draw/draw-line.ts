import { LineShape } from "../types/types";

export const drawLine = (ctx: CanvasRenderingContext2D, shape: LineShape) => {
  const { x, y, points } = shape;

  if (points.length < 2) return;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

  const first = points[0];
  if (!first) return;

  ctx.beginPath();

  ctx.moveTo(x + first[0], y + first[1]);

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (!point) continue;

    ctx.lineTo(x + point[0], y + point[1]);
  }

  ctx.stroke();
};
