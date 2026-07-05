import { EllipseShape } from "../../types/types";
import getStrokeStyleValue from "../../utils/get-stroke-style-value";

export const drawEllipse = (
  ctx: CanvasRenderingContext2D,
  shape: EllipseShape,
) => {
  const { x, y, width, height } = shape;

  ctx.save();
  const strokeValue = getStrokeStyleValue(shape.strokeStyle ?? "solid");
  ctx.setLineDash(strokeValue);
  ctx.lineWidth = shape.strokeWidth ?? 2;
  ctx.strokeStyle = shape.strokeColor ?? "white";
  ctx.fillStyle = shape.backgroundColor ?? "white";
  ctx.globalAlpha = (shape.opacity ?? 100) / 100;

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  const radiusX = width / 2;
  const radiusY = height / 2;

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};
