import { getAbsolutePoint } from "../../get-absolute-point";
import { distanceToSegment } from "./distance-to-segment";
import { TOLERANCE } from "@/features/editor/constants/canvas";
import { PointsShape } from "../../types";
import { Point } from "@/features/editor/types";

export function pointInSegment(
  point: Point,
  shape: PointsShape,
  scale: number,
  tolerance?: number,
): PointsShape | null {
  const scaledTolerance = (tolerance ?? TOLERANCE) / scale;

  const {
    x,
    y,
    data: { points },
  } = shape;

  for (let i = 0; i < points.length - 1; i++) {
    // firstPoint, secondPoint -> Relative Distance Point from Start (x, y)
    const firstPoint = points[i];
    const secondPoint = points[i + 1];

    if (!firstPoint || !secondPoint) return null;

    const startPoint = getAbsolutePoint(x, y, firstPoint);
    const endPoint = getAbsolutePoint(x, y, secondPoint);

    const distance = distanceToSegment(point, startPoint, endPoint);

    if (distance <= scaledTolerance) {
      return shape;
    }
  }

  return null;
}
