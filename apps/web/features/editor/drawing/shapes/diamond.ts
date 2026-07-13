import getStrokeStyleValue from "../../components/properties-panel/get-stroke-style-value";
import { DiamondShape } from "../../types";

// Draw a Diamond
export const drawDiamond = (
  ctx: CanvasRenderingContext2D,
  shape: DiamondShape,
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
