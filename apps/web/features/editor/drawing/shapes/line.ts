import { getAbsolutePoint } from "../../geometry/get-absolute-point";
import getStrokeStyleValue from "../../components/properties-panel/get-stroke-style-value";
import { LineShape } from "../../types";

export const drawLine = (ctx: CanvasRenderingContext2D, shape: LineShape) => {
  const {
    x,
    y,
    appearance: { strokeStyle, strokeWidth, strokeColor, opacity },
    data: { points },
  } = shape;

  if (points.length < 2) return;

  const strokeValue = getStrokeStyleValue(strokeStyle);

  ctx.save();

  ctx.setLineDash(strokeValue);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeColor;
  ctx.globalAlpha = opacity / 100;

  const first = points[0];
  if (!first) {
    ctx.restore();
    return;
  }

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
  ctx.restore();
};
