import getStrokeStyleValue from "../../components/properties-panel/get-stroke-style-value";
import { RectangleShape } from "../../types";

export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
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
      roundness,
    },
  } = shape;

  ctx.save();
  ctx.beginPath();

  const strokeValue = getStrokeStyleValue(strokeStyle);

  ctx.setLineDash(strokeValue);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = backgroundColor;
  ctx.globalAlpha = opacity / 100;

  ctx.roundRect(x, y, width, height, roundness ?? 10);

  ctx.fill();
  ctx.stroke();

  ctx.closePath();
  ctx.restore();
};
