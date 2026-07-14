import getStrokeStyleValue from "../../components/properties-panel/get-stroke-style-value";
import { EllipseShape } from "../../types";

export const drawEllipse = (
  ctx: CanvasRenderingContext2D,
  shape: EllipseShape,
) => {
  const {
    x,
    y,
    width,
    height,
    appearance: {
      strokeStyle,
      strokeWidth,
      strokeColor,
      backgroundColor,
      opacity,
    },
  } = shape;

  ctx.save();

  const strokeValue = getStrokeStyleValue(strokeStyle);

  ctx.setLineDash(strokeValue);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = backgroundColor;
  ctx.globalAlpha = opacity / 100;

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
