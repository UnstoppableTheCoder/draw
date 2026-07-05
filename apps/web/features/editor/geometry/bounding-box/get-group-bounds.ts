import { SelectedBounds, Shape } from "../../types/types";
import { getBoundingBox } from "./get-bounding-box";

export function getGroupBounds(shapes: Shape[]): SelectedBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const shape of shapes) {
    const bounds = getBoundingBox(shape);

    minX = Math.min(minX, bounds.minX);
    minY = Math.min(minY, bounds.minY);

    maxX = Math.max(maxX, bounds.maxX);
    maxY = Math.max(maxY, bounds.maxY);
  }

  return { minX, minY, maxX, maxY };
}
