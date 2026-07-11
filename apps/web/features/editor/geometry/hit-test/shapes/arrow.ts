import { ArrowShape } from "@/features/editor/types/types";
import { Point } from "@/types/canvas";
import { PointsShape } from "../../types";
import { pointInSegment } from "../algorithms/point-in-segment";

export const pointInArrow = (
  point: Point,
  shape: ArrowShape,
  scale: number,
  tolerance?: number,
): PointsShape | null => {
  return pointInSegment(point, shape, scale, tolerance);
};
