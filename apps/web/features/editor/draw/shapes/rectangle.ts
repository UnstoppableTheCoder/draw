import { RectangleShape } from "../../types/types";

export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
) => {
  const { x, y, width, height } = shape;

  ctx.beginPath();

  ctx.lineWidth = 2;
  ctx.strokeStyle = shape.strokeColor ?? "white";
  ctx.fillStyle = shape.backgroundColor ?? "white";

  ctx.roundRect(x, y, width, height, 10);

  ctx.fill();
  ctx.stroke();

  ctx.closePath();
};
