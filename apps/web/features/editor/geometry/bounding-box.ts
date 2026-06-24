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
import { ResizeHandleType } from "../types/resize-handle";

type ShapeWithPoints = ArrowShape | LineShape | FreeDrawShape;

type ShapeWithoutPoints =
  | RectangleShape
  | DiamondShape
  | EllipseShape
  | TextShape
  | ImageShape;

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

    updateBounds({ x, y });

    updateBounds({
      x: x + width,
      y: y + height,
    });
  };

  const updateBoundsForShapesWithPoints = (shape: ShapeWithPoints) => {
    const { x, y, points } = shape;

    points.forEach((point) => {
      updateBounds(getAbsolutePoint(x, y, point));
    });
  };

  switch (shape.type) {
    case "rectangle":
    case "diamond":
    case "ellipse":
    case "text":
    case "image":
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

function isPointInsideRect({
  point,
  x,
  y,
  width,
  height,
}: {
  point: Point;
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return (
    point.x >= x &&
    point.x <= x + width &&
    point.y >= y &&
    point.y <= y + height
  );
}

function isPointInCircle(center: Point, clickedPoint: Point, scale: number) {
  const radius = 5 / scale;

  return (
    Math.hypot(clickedPoint.x - center.x, clickedPoint.y - center.y) <= radius
  );
}

function getCornerHandle(
  point: Point,
  bounds: SelectedShapeBounds,
  scale: number,
): ResizeHandleType {
  const handleSize = 8 / scale;
  const halfHandle = handleSize / 2;

  const { minX, minY, maxX, maxY } = bounds;

  const corners = [
    {
      type: "top-left" as const,
      x: minX,
      y: minY,
    },
    {
      type: "top-right" as const,
      x: maxX,
      y: minY,
    },
    {
      type: "bottom-left" as const,
      x: minX,
      y: maxY,
    },
    {
      type: "bottom-right" as const,
      x: maxX,
      y: maxY,
    },
  ];

  for (const corner of corners) {
    const isInside = isPointInsideRect({
      point,
      x: corner.x - halfHandle,
      y: corner.y - halfHandle,
      width: handleSize,
      height: handleSize,
    });

    if (isInside) {
      return corner.type;
    }
  }

  return null;
}

function getSegmentHandle(
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
    if (isPointInCircle(handle.point, point, scale)) {
      return handle.type;
    }
  }

  return null;
}

export function getResizeHandleAtPoint(
  point: Point,
  selectedShape: Shape,
  bounds: SelectedShapeBounds | null,
  scale: number,
): ResizeHandleType {
  if (!bounds) {
    return null;
  }

  if (selectedShape.type === "line" || selectedShape.type === "arrow") {
    return getSegmentHandle(point, selectedShape, scale);
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
