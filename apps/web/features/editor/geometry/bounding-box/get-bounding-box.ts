import { TOLERANCE } from "../../constants/canvas";
import { Point, PointTuple, Shape } from "../../types";
import { getAbsolutePoint } from "../get-absolute-point";
import { ShapeWithoutPoints, ShapeWithPoints } from "../types";

export function getBoundingBox(shape: Shape) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const updateBounds = (point: Point) => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  };

  const updateBoundsForShapesWithoutPoints = (shape: ShapeWithoutPoints) => {
    const { x, y, width, height } = shape;
    if (!width || !height) return;

    updateBounds({ x, y });

    updateBounds({
      x: x + width,
      y: y + height,
    });
  };

  const updateBoundsForShapesWithPoints = (shape: ShapeWithPoints) => {
    const { x, y, points } = shape;

    points.forEach((point: PointTuple) => {
      updateBounds(getAbsolutePoint(x, y, point));
    });
  };

  switch (shape.type) {
    case "rectangle":
    case "diamond":
    case "ellipse":
    case "text":
    case "image":
    case "frame":
      updateBoundsForShapesWithoutPoints(shape);
      break;

    case "line":
    case "arrow":
    case "freedraw":
      updateBoundsForShapesWithPoints(shape);
      break;
  }

  return {
    minX: minX - TOLERANCE,
    minY: minY - TOLERANCE,
    maxX: maxX + TOLERANCE,
    maxY: maxY + TOLERANCE,
  };
}
