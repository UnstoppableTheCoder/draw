import { TOLERANCE } from "@/features/editor/constants/canvas";
import { TextShape } from "@/features/editor/types/types";
import { Point } from "@/types/canvas.types";

export const pointInText = (
  point: Point,
  shape: TextShape,
  scale: number,
  tolerance?: number,
): TextShape | null => {
  const { x, y, width, height } = shape;
  if (!width || !height) return null;

  const scaledTolerance = (tolerance ?? TOLERANCE) / scale;

  const inside =
    point.x >= x - scaledTolerance &&
    point.y >= y - scaledTolerance &&
    point.x <= x + width + scaledTolerance &&
    point.y <= y + height + scaledTolerance;

  return inside ? shape : null;
};
