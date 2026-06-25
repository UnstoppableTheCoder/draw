import { TOLERANCE } from "../constants/canvas";
import {
  ArrowShape,
  DiamondShape,
  EllipseShape,
  FreeDrawShape,
  ImageShape,
  LineShape,
  Point,
  RectangleShape,
  SelectedShapeBounds,
  Shape,
  TextShape,
} from "../types/types";
import { getAbsolutePoint } from "../utils/get-absolute-point";

type PointsShape = ArrowShape | LineShape | FreeDrawShape;

function pointInPolygon(point: Point, vertices: Point[]) {
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

function distanceToSegment(point: Point, start: Point, end: Point): number {
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

function pointInSegment(point: Point, shape: PointsShape): PointsShape | null {
  for (let i = 0; i < shape.points.length - 1; i++) {
    // firstPoint, secondPoint -> Relative Distance Point from Start (x, y)
    const firstPoint = shape.points[i];
    const secondPoint = shape.points[i + 1];

    if (!firstPoint || !secondPoint) return null;

    const startPoint = getAbsolutePoint(shape.x, shape.y, firstPoint);
    const endPoint = getAbsolutePoint(shape.x, shape.y, secondPoint);

    const distance = distanceToSegment(point, startPoint, endPoint);

    if (distance <= TOLERANCE) {
      return shape;
    }
  }

  return null;
}

export const pointInRectangle = (
  point: Point,
  shape: RectangleShape,
): RectangleShape | null => {
  const inside =
    point.x >= shape.x - TOLERANCE &&
    point.y >= shape.y - TOLERANCE &&
    point.x <= shape.x + shape.width + TOLERANCE &&
    point.y <= shape.y + shape.height + TOLERANCE;

  return inside ? shape : null;
};

const pointInDiamond = (
  point: Point,
  shape: DiamondShape,
): DiamondShape | null => {
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;

  const dx = Math.abs(point.x - centerX);
  const dy = Math.abs(point.y - centerY);

  const halfWidth = shape.width / 2;
  const halfHeight = shape.height / 2;

  // Formula
  const inside =
    dx / (halfWidth + TOLERANCE) + dy / (halfHeight + TOLERANCE) <= 1;

  return inside ? shape : null;
};

const pointInEllipse = (
  point: Point,
  shape: EllipseShape,
): EllipseShape | null => {
  const radiusX = shape.width / 2;
  const radiusY = shape.height / 2;

  const centerX = shape.x + radiusX;
  const centerY = shape.y + radiusY;

  // Distance vector point and center
  const dx = point.x - centerX;
  const dy = point.y - centerY;

  // Equation of an Ellipse -> (x - cx)^2 / a^2 + (y - cy)^2 / b^2 <= 1
  // (x, y) -> point, (cx, cy) -> center, (a, b) -> radius (rx, ry)
  const inside =
    (dx * dx) / (radiusX + TOLERANCE) ** 2 +
      (dy * dy) / (radiusY + TOLERANCE) ** 2 <=
    1;

  return inside ? shape : null;
};

const pointInArrow = (point: Point, shape: ArrowShape): PointsShape | null => {
  return pointInSegment(point, shape);
};

const pointInLine = (point: Point, shape: LineShape): PointsShape | null => {
  return pointInSegment(point, shape);
};

const pointInFreeDraw = (
  point: Point,
  shape: FreeDrawShape,
): PointsShape | null => {
  return pointInSegment(point, shape);
};

const pointInText = (point: Point, shape: TextShape): TextShape | null => {
  const inside =
    point.x >= shape.x - TOLERANCE &&
    point.y >= shape.y - TOLERANCE &&
    point.x <= shape.x + shape.width + TOLERANCE &&
    point.y <= shape.y + shape.height + TOLERANCE;

  return inside ? shape : null;
};

const pointInImage = (point: Point, shape: ImageShape): ImageShape | null => {
  const inside =
    point.x >= shape.x - TOLERANCE &&
    point.y >= shape.y - TOLERANCE &&
    point.x <= shape.x + shape.width + TOLERANCE &&
    point.y <= shape.y + shape.height + TOLERANCE;

  return inside ? shape : null;
};

export const getPointInShape = (startPoint: Point, shape: Shape): Shape | null => {
  switch (shape.type) {
    case "rectangle":
      return pointInRectangle(startPoint, shape);

    case "diamond":
      return pointInDiamond(startPoint, shape);

    case "ellipse":
      return pointInEllipse(startPoint, shape);

    case "arrow":
      return pointInArrow(startPoint, shape);

    case "line":
      return pointInLine(startPoint, shape);

    case "freedraw":
      return pointInFreeDraw(startPoint, shape);

    case "text":
      return pointInText(startPoint, shape);

    case "image":
      return pointInImage(startPoint, shape);

    default:
      return null;
  }
};

export const isPointInSelectedShapeBounds = (
  point: Point,
  bounds: SelectedShapeBounds | null,
): boolean => {
  if (!bounds) return false;
  const { minX, minY, maxX, maxY } = bounds;

  // Adding the tolerance here so that even if you click a little away - resizeHandler is active
  const inside =
    point.x >= minX - TOLERANCE &&
    point.y >= minY - TOLERANCE &&
    point.x <= maxX + TOLERANCE &&
    point.y <= maxY + TOLERANCE;
  return inside ? true : false;
};

export const getShapeAtPosition = ({
  point,
  shapes,
  selectedShape,
  selectedShapeBounds,
}: {
  point: Point;
  shapes: Shape[];
  selectedShape: Shape | null;
  selectedShapeBounds: SelectedShapeBounds | null;
}): Shape | null => {
  if (
    selectedShape &&
    isPointInSelectedShapeBounds(point, selectedShapeBounds)
  ) {
    return selectedShape;
  }

  for (const shape of shapes) {
    const hitShape = getPointInShape(point, shape);

    if (hitShape) {
      return hitShape;
    }
  }

  return null;
};
