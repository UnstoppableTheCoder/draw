import { RectangleShape } from "../types/types";

export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
) => {
  const { x, y, width, height } = shape;

  // Set Properties to Rectangle
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

  ctx.strokeRect(x, y, width, height);
};
