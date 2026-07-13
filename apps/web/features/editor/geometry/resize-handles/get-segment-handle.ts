import { ArrowShape, LineShape, Point } from "../../types";
import { ResizeHandleType } from "../../types/resize-handle";
import { getAbsolutePoint } from "../get-absolute-point";

function isPointInsideCircle(
  center: Point,
  clickedPoint: Point,
  scale: number,
) {
  const radius = 5 / scale;

  return (
    Math.hypot(clickedPoint.x - center.x, clickedPoint.y - center.y) <= radius
  );
}

export function getSegmentHandle(
  point: Point,
  selectedShape: LineShape | ArrowShape,
  scale: number,
): ResizeHandleType {
  const [startRel, endRel] = selectedShape.points;
  if (!startRel || !endRel) {
    return null;
  }

  const start = getAbsolutePoint(selectedShape.x, selectedShape.y, startRel);
  const end = getAbsolutePoint(selectedShape.x, selectedShape.y, endRel);
  const middle = {
    x: start.x + (end.x - start.x) / 2,
    y: start.y + (end.y - start.y) / 2,
  };

  const handles = [
    {
      type: "start" as const,
      point: start,
    },
    {
      type: "middle" as const,
      point: middle,
    },
    {
      type: "end" as const,
      point: end,
    },
  ];

  for (const handle of handles) {
    if (isPointInsideCircle(handle.point, point, scale)) {
      return handle.type;
    }
  }

  return null;
}
