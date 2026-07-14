import { TOLERANCE } from "@/features/editor/constants/canvas";
import { FrameShape, Point } from "@/features/editor/types";

export const pointInFrame = (
  point: Point,
  shape: FrameShape,
  scale: number,
  tolerance?: number,
): FrameShape | null => {
  const {
    x,
    y,
    width,
    height,
    data: { text },
  } = shape;

  const scaledTolerance = (tolerance ?? TOLERANCE) / scale;
  const scaledTextHeight = text.height / scale;
  const scaledTextWidth = text.width / scale;

  const inside =
    point.x >= x - scaledTolerance &&
    point.y >= y - scaledTolerance &&
    point.x <= x + width + scaledTolerance &&
    point.y <= y + height + scaledTolerance;

  const insideText =
    point.x >= x &&
    point.y <= y &&
    point.x <= x + scaledTextWidth &&
    point.y >= y - scaledTextHeight - scaledTolerance;

  return inside || insideText ? shape : null;
};
