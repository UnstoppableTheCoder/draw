import { TextShape } from "../../types/types";

export const drawText = (ctx: CanvasRenderingContext2D, shape: TextShape) => {
  const { x, y, text, fontSize, fontFamily, strokeColor } = shape;

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = strokeColor || "white";
  ctx.textBaseline = "top";
  ctx.globalAlpha = (shape.opacity ?? 100) / 100;

  const lineHeight = fontSize * 1.2;

  text.split("\n").forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
};
