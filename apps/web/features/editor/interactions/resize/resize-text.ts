import { TOLERANCE } from "../../constants/canvas";
import { SelectedBounds } from "../../types/types";
import getTextDimensions from "../../geometry/text/get-text-dimensions";
import { TextShape } from "../../types";

export default function resizeTextShape({
  ctx,
  shape,
  rect,
  initialBounds,
  initialFontSize,
  scale,
}: {
  ctx: CanvasRenderingContext2D;
  shape: TextShape;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  initialBounds: SelectedBounds;
  initialFontSize: number;
  scale?: number;
}) {
  const updatedShape: TextShape = {
    ...shape,
    ...rect,
    data: {
      ...shape.data,
    },
  };

  let { minX, minY, maxX, maxY } = initialBounds;

  // Removing the added Tolerance
  minX = minX + TOLERANCE;
  minY = minY + TOLERANCE;
  maxX = maxX - TOLERANCE;
  maxY = maxY - TOLERANCE;

  const oldHeight = maxY - minY;
  const oldWidth = maxX - minX;
  const newHeight = rect.height;
  const newWidth = rect.width;

  const scaleX = oldWidth === 0 ? 1 : newWidth / oldWidth;
  const scaleY = oldHeight === 0 ? 1 : newHeight / oldHeight;

  updatedShape.data.fontSize = Math.max(1, initialFontSize * (scale ?? scaleY));

  const dimensions = getTextDimensions({
    ctx,
    text: updatedShape.data.text,
    fontSize: updatedShape.data.fontSize,
    fontFamily: updatedShape.data.fontFamily,
  });

  if (dimensions) {
    updatedShape.width = dimensions.width;
    updatedShape.height = dimensions.height;
  }

  return updatedShape;
}
