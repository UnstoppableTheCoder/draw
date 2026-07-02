import { TOLERANCE } from "@/features/editor/constants/canvas";
import { TextShape } from "@/features/editor/types/types";
import { Point } from "@/types/canvas.types";

export const pointInText = (
  point: Point,
  shape: TextShape,
  tolerance?: number,
): TextShape | null => {
  const { x, y, width, height } = shape;
  if (!width || !height) return null;

  const inside =
    point.x >= x - (tolerance ?? TOLERANCE) &&
    point.y >= y - (tolerance ?? TOLERANCE) &&
    point.x <= x + width + (tolerance ?? TOLERANCE) &&
    point.y <= y + height + (tolerance ?? TOLERANCE);

  return inside ? shape : null;
};
