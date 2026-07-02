import { TOLERANCE } from "@/features/editor/constants/canvas";
import { ImageShape } from "@/features/editor/types/types";
import { Point } from "@/types/canvas.types";

export const pointInImage = (
  point: Point,
  shape: ImageShape,
  tolerance?: number,
): ImageShape | null => {
  const inside =
    point.x >= shape.x - (tolerance ?? TOLERANCE) &&
    point.y >= shape.y - (tolerance ?? TOLERANCE) &&
    point.x <= shape.x + shape.width + (tolerance ?? TOLERANCE) &&
    point.y <= shape.y + shape.height + (tolerance ?? TOLERANCE);

  return inside ? shape : null;
};
