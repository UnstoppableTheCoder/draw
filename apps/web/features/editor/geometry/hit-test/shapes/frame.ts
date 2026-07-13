import { TOLERANCE } from "@/features/editor/constants/canvas";
import { FrameShape, Point } from "@/features/editor/types";

export const pointInFrame = (
  point: Point,
  shape: FrameShape,
  scale: number,
  tolerance?: number,
): FrameShape | null => {
  const text = shape.text;

  const scaledTolerance = (tolerance ?? TOLERANCE) / scale;
  const scaledTextHeight = text.height / scale;
  const scaledTextWidth = text.width / scale;

  const inside =
    point.x >= shape.x - scaledTolerance / scale &&
    point.y >= shape.y - scaledTolerance / scale &&
    point.x <= shape.x + shape.width + scaledTolerance / scale &&
    point.y <= shape.y + shape.height + scaledTolerance / scale;

  const insideText =
    point.x >= shape.x &&
    point.y <= shape.y &&
    point.x <= shape.x + scaledTextWidth &&
    point.y >= shape.y - scaledTextHeight - scaledTolerance;

  return inside || insideText ? shape : null;
};
