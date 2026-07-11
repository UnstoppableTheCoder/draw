import { Point } from "@/types/canvas";
import { SelectedBounds } from "../../types/types";

export function getSelectionBoxBounds(
  startPoint: Point,
  endPoint: Point,
): SelectedBounds {
  const minX = Math.min(startPoint.x, endPoint.x);
  const minY = Math.min(startPoint.y, endPoint.y);
  const maxX = Math.max(startPoint.x, endPoint.x);
  const maxY = Math.max(startPoint.y, endPoint.y);

  return { minX, minY, maxX, maxY };
}
