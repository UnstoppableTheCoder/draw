import { RefObject } from "react";

type Dimensions = {
  width: number;
  height: number;
};

export default function getTextDimensions(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  text: string,
  font: string,
): Dimensions | null {
  if (!canvasRef) return null;

  const ctx = canvasRef.current?.getContext("2d");
  if (!ctx) return null;

  // font -> "20 Arial"
  ctx.font = font;

  const lines = text.split("\n");
  const width = Math.max(...lines.map((line) => ctx.measureText(line).width));
  const totalHeight = lines.length * parseInt(font) * 1.2;

  return { width, height: totalHeight };
}
