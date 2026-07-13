import { Point } from "@/features/editor/types";

export function distanceToSegment(
  point: Point,
  start: Point,
  end: Point,
): number {
  // point -> P, start -> A, end -> B

  // Steps:
  // Vector of AB
  // Vector of AP
  // Dot Product -> AB.AP -> tells us the alignment of AP towards AB
  // Dot Product -> AB.AB
  // t => AB.AP / AB.AB -> (at start -> t = 0 and at end t = 1)
  // Closes Point on the line
  // Distance from Point to Segment

  // Vector AB -> (dx, dy)
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Vector AP -> (pdx, pdy)
  const pdx = point.x - start.x;
  const pdy = point.y - start.y;

  // Dot Product -> AB.AB -> (dx, dy).(dx, dy) -> dx * dx + dy * dy
  const lengthSquared = dx * dx + dy * dy;

  // Segment is actually a point
  // Math.hypot -> returns -> Distance Between 2 Points -> Square Root of ((x2-x1) ** 2 + (y2 - y2) ** 2)
  if (lengthSquared === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  // Dot Product -> AP.AB -> (pdx, pdy).(dx, dy) -> pdx * dx + pdy * dy
  // Projection factor -> AP.AB / AB.AB
  let t = (pdx * dx + pdy * dy) / lengthSquared;

  // Clamp to segment -> t -> should always be b/w (0, 1) -> 0 -> starting and 1 -> ending
  // if t = 1.5 -> t = 1 and t = -1.5 -> t = 0
  // So that we can get the distance between the closest (qx, qy) point and (start (x1, y1) or end (x2, y2) of the line)
  t = Math.max(0, Math.min(1, t));

  // Closest Point -> Q = A + t(AB) -> (start.x, start.y) + t(dx, dy)
  // Closest Point -> (qx, qy)
  const closestX = start.x + t * dx;
  const closestY = start.y + t * dy;

  // Math.hypot -> gets the distance between two points
  return Math.hypot(point.x - closestX, point.y - closestY);
}
