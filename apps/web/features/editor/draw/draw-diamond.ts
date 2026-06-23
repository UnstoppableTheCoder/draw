import { DiamondShape } from "../types/types";

// Draw a Diamond
export const drawDiamond = (
  ctx: CanvasRenderingContext2D,
  shape: DiamondShape,
) => {
  const { x, y, width, height } = shape;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

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
};
