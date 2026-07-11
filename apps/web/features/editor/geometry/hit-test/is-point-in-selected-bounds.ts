import { Point } from "@/types/canvas";
import { TOLERANCE } from "../../constants/canvas";
import { SelectedBounds } from "../../types/types";

export const isPointInSelectedShapeBounds = (
  point: Point,
  bounds: SelectedBounds | null,
): boolean => {
  if (!bounds) return false;
  const { minX, minY, maxX, maxY } = bounds;

  // Adding the tolerance here so that even if you click a little away - resizeHandler is active
  const inside =
    point.x >= minX - TOLERANCE &&
    point.y >= minY - TOLERANCE &&
    point.x <= maxX + TOLERANCE &&
    point.y <= maxY + TOLERANCE;
  return inside ? true : false;
};
