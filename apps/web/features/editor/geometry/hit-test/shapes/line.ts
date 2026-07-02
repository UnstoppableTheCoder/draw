import { LineShape } from "@/features/editor/types/types";
import { Point } from "@/types/canvas.types";
import { PointsShape } from "../../types";
import { pointInSegment } from "../algorithms/point-in-segment";

export const pointInLine = (
  point: Point,
  shape: LineShape,
  tolerance?: number,
): PointsShape | null => {
  return pointInSegment(point, shape, tolerance);
};
