import getStrokeStyleValue from "../../components/properties-panel/get-stroke-style-value";
import { DiamondShape } from "../../types";

// Draw a Diamond
export const drawDiamond = (
  ctx: CanvasRenderingContext2D,
  shape: DiamondShape,
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

  ctx.beginPath();

  // Top
  ctx.moveTo(centerX, y);
  // Right
  ctx.lineTo(x + width, centerY);
  // Bottom
  ctx.lineTo(centerX, y + height);
  // Left
  ctx.lineTo(x, centerY);

  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};
