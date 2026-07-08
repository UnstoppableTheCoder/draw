import { TOLERANCE } from "@/features/editor/constants/canvas";
import { RectangleShape } from "@/features/editor/types/types";
import { Point } from "@/types/canvas.types";

export const pointInRectangle = (
  point: Point,
  shape: RectangleShape,
  scale: number,
  tolerance?: number,
): RectangleShape | null => {
  const scaledTolerance = (tolerance ?? TOLERANCE) / scale;

  const inside =
    point.x >= shape.x - scaledTolerance &&
    point.y >= shape.y - scaledTolerance &&
    point.x <= shape.x + shape.width + scaledTolerance &&
    point.y <= shape.y + shape.height + scaledTolerance;

  return inside ? shape : null;
};
