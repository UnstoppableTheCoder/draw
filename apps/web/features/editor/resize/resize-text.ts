import { RefObject } from "react";
import { TOLERANCE } from "../constants/canvas";
import { SelectedShapeBounds, TextShape } from "../types/types";
import getTextDimensions from "../utils/get-text-dimensions";

export default function resizeTextShape({
  canvasRef,
  selectedShape,
  rect,
  resizeStartBounds,
  resizeStartFontSize,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  selectedShape: TextShape;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  resizeStartBounds: SelectedShapeBounds;
  resizeStartFontSize: number;
}) {
  const updatedShape = { ...selectedShape, ...rect };

  let { minX, minY, maxX, maxY } = resizeStartBounds;

  // Removing the added Tolerance
  minX = minX + TOLERANCE;
  minY = minY + TOLERANCE;
  maxX = maxX - TOLERANCE;
  maxY = maxY - TOLERANCE;

  const oldHeight = maxY - minY;
  const newHeight = rect.height;

  const scale = oldHeight === 0 ? 1 : newHeight / oldHeight;

  updatedShape.fontSize = Math.max(1, resizeStartFontSize * scale);

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
