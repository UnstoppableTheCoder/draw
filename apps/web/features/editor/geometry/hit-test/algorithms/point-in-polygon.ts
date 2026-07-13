import { Point } from "@/features/editor/types";

export function pointInPolygon(
  point: Point,
  vertices: Point[],
  tolerance?: number,
) {
  let inside = false;

  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    // [A, B, C, D] -> (i, j) -> (0, 3) -> (1, 0) -> (2, 1) -> (3, 2)
    const xi = vertices[i]?.x;
    const yi = vertices[i]?.y;

    const xj = vertices[j]?.x;
    const yj = vertices[j]?.y;

    if (!xi || !yi || !xj || !yj) return;

    // Formula
    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}
