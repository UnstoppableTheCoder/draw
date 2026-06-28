import { RefObject } from "react";
import { TOLERANCE } from "../constants/canvas";
import { SelectedShapeBounds, TextShape } from "../types/types";
import getTextDimensions from "../utils/get-text-dimensions";

export default function resizeTextShape({
  canvasRef,
  shape,
  rect,
  initialBounds,
  initialFontSize,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  shape: TextShape;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  initialBounds: SelectedShapeBounds;
  initialFontSize: number;
}) {
  const updatedShape = { ...shape, ...rect };

  let { minX, minY, maxX, maxY } = initialBounds;

  // Removing the added Tolerance
  minX = minX + TOLERANCE;
  minY = minY + TOLERANCE;
  maxX = maxX - TOLERANCE;
  maxY = maxY - TOLERANCE;

  const oldHeight = maxY - minY;
  const newHeight = rect.height;

  const scale = oldHeight === 0 ? 1 : newHeight / oldHeight;

  updatedShape.fontSize = Math.max(1, initialFontSize * scale);

  const dimensions = getTextDimensions(
    canvasRef,
    updatedShape.text,
    updatedShape.fontSize,
    updatedShape.fontFamily,
  );

  if (dimensions) {
    updatedShape.width = dimensions.width;
    updatedShape.height = dimensions.height;
  }

  return updatedShape;
}
