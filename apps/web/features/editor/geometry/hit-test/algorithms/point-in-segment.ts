import { Point } from "@/types/canvas";
import { getAbsolutePoint } from "../../get-absolute-point";
import { distanceToSegment } from "./distance-to-segment";
import { TOLERANCE } from "@/features/editor/constants/canvas";
import { PointsShape } from "../../types";
import { scalePointInGroup } from "@/features/editor/interactions/resize/scale-shape-in-group";

export function pointInSegment(
  point: Point,
  shape: PointsShape,
  scale: number,
  tolerance?: number,
): PointsShape | null {
  const scaledTolerance = (tolerance ?? TOLERANCE) / scale;

  for (let i = 0; i < shape.points.length - 1; i++) {
    // firstPoint, secondPoint -> Relative Distance Point from Start (x, y)
    const firstPoint = shape.points[i];
    const secondPoint = shape.points[i + 1];

    if (!firstPoint || !secondPoint) return null;

    const startPoint = getAbsolutePoint(shape.x, shape.y, firstPoint);
    const endPoint = getAbsolutePoint(shape.x, shape.y, secondPoint);

    const distance = distanceToSegment(point, startPoint, endPoint);

    if (distance <= scaledTolerance) {
      return shape;
    }
  }

  return null;
}
