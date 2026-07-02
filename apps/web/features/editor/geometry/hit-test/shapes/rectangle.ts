import { TOLERANCE } from "@/features/editor/constants/canvas";
import { RectangleShape } from "@/features/editor/types/types";
import { Point } from "@/types/canvas.types";

export const pointInRectangle = (
  point: Point,
  shape: RectangleShape,
  tolerance?: number,
): RectangleShape | null => {
  const inside =
    point.x >= shape.x - (tolerance ?? TOLERANCE) &&
    point.y >= shape.y - (tolerance ?? TOLERANCE) &&
    point.x <= shape.x + shape.width + (tolerance ?? TOLERANCE) &&
    point.y <= shape.y + shape.height + (tolerance ?? TOLERANCE);

  return inside ? shape : null;
};
