import { RectangleShape } from "../../types/types";
import getStrokeStyleValue from "../../utils/get-stroke-style-value";

export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
) => {
  const { x, y, width, height } = shape;

  ctx.beginPath();

  const strokeValue = getStrokeStyleValue(shape.strokeStyle ?? "solid");
  ctx.setLineDash(strokeValue);
  ctx.lineWidth = shape.strokeWidth ?? 2;
  ctx.strokeStyle = shape.strokeColor ?? "white";
  ctx.fillStyle = shape.backgroundColor ?? "white";
  ctx.globalAlpha = (shape.opacity ?? 100) / 100;

  ctx.roundRect(x, y, width, height, shape.roundness ?? 10);

  ctx.fill();
  ctx.stroke();

  ctx.closePath();
};
