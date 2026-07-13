import { ResizeHandleType } from "../../types/resize-handle";
import { getSegmentHandle } from "./get-segment-handle";
import { getCornerHandle } from "./get-corner-handle";
import { TOLERANCE } from "../../constants/canvas";
import { Point, SelectedBounds, Shape } from "../../types";

export function getResizeHandleAtPoint({
  point,
  shapes,
  bounds,
  scale,
}: {
  point: Point;
  shapes: Shape[];
  bounds: SelectedBounds | null;
  scale: number;
}): ResizeHandleType {
  if (!bounds) {
    return null;
  }

  const isGroupSelection = shapes.length > 1;
  const firstShape = shapes[0];
  if (!firstShape) return null;

  if (
    !isGroupSelection &&
    (firstShape.type === "line" || firstShape.type === "arrow")
  ) {
    return getSegmentHandle(point, firstShape, scale);
  }

  const { minX, minY, maxX, maxY } = bounds;
  const corner = getCornerHandle(point, bounds, scale);
  if (corner) {
    return corner;
  }

  if (
    point.x >= minX &&
    point.x <= maxX &&
    point.y >= minY &&
    point.y <= minY + TOLERANCE
  ) {
    return "top";
  }

  if (
    point.x >= minX &&
    point.x <= maxX &&
    point.y >= maxY - TOLERANCE &&
    point.y <= maxY
  ) {
    return "bottom";
  }

  if (
    point.y >= minY &&
    point.y <= maxY &&
    point.x >= minX &&
    point.x <= minX + TOLERANCE
  ) {
    return "left";
  }

  if (
    point.y >= minY &&
    point.y <= maxY &&
    point.x >= maxX - TOLERANCE &&
    point.x <= maxX
  ) {
    return "right";
  }

  return null;
}
