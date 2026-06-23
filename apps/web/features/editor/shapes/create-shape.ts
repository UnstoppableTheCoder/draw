import { ToolType } from "@/types/toolbar.types";
import {
  ArrowShape,
  DiamondShape,
  EllipseShape,
  FreeDrawShape,
  LineShape,
  Point,
  PointTuple,
  RectangleShape,
  Shape,
} from "../types/types";
import { normalizeRect } from "../utils/normalize-rect";
import { v4 as uuidv4 } from "uuid";

// Rectangle
export const createRectangleShape = (
  start: Point,
  end: Point,
): RectangleShape => ({
  type: "rectangle",
  id: uuidv4(),
  ...normalizeRect(start, end),
});

// Diamond
export const createDiamondShape = (start: Point, end: Point): DiamondShape => ({
  type: "diamond",
  id: uuidv4(),
  ...normalizeRect(start, end),
});

// Ellipse
export const createEllipseShape = (start: Point, end: Point): EllipseShape => ({
  type: "ellipse",
  id: uuidv4(),
  ...normalizeRect(start, end),
});

// Arrow
export const createArrowShape = (
  start: Point,
  points: PointTuple[],
): ArrowShape => ({
  type: "arrow",
  id: uuidv4(),
  x: start.x,
  y: start.y,
  points,
});

// Line
export const createLineShape = (
  start: Point,
  points: PointTuple[],
): LineShape => ({
  type: "line",
  id: uuidv4(),
  x: start.x,
  y: start.y,
  points,
});

// Free Draw
export const createFreeDrawShape = (
  start: Point,
  points: PointTuple[],
): FreeDrawShape => ({
  type: "freedraw",
  id: uuidv4(),
  x: start.x,
  y: start.y,
  points,
});

// Shape Factory
export const createShape = ({
  tool,
  startPoint,
  endPoint,
  points,
}: {
  tool: ToolType;
  startPoint: Point;
  endPoint: Point;
  points: PointTuple[];
}): Shape | null => {
  switch (tool) {
    case "rectangle":
      return createRectangleShape(startPoint, endPoint);

    case "diamond":
      return createDiamondShape(startPoint, endPoint);

    case "ellipse":
      return createEllipseShape(startPoint, endPoint);

    case "arrow":
      return createArrowShape(startPoint, points);

    case "line":
      return createLineShape(startPoint, points);

    case "freedraw":
      return createFreeDrawShape(startPoint, points);

    default:
      return null;
  }
};
