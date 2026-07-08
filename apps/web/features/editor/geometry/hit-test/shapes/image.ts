import { TOLERANCE } from "@/features/editor/constants/canvas";
import { ImageShape } from "@/features/editor/types/types";
import { Point } from "@/types/canvas.types";

export const pointInImage = (
  point: Point,
  shape: ImageShape,
  scale: number,
  tolerance?: number,
): ImageShape | null => {
  const scaledTolerance = (tolerance ?? TOLERANCE) / scale;

  const inside =
    point.x >= shape.x - scaledTolerance &&
    point.y >= shape.y - scaledTolerance &&
    point.x <= shape.x + shape.width + scaledTolerance &&
    point.y <= shape.y + shape.height + scaledTolerance;

  return inside ? shape : null;
};
