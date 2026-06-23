import { EllipseShape } from "../types/types";

export const drawEllipse = (
  ctx: CanvasRenderingContext2D,
  shape: EllipseShape,
) => {
  const { x, y, width, height } = shape;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  const radiusX = width / 2;
  const radiusY = height / 2;

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.stroke();
};
