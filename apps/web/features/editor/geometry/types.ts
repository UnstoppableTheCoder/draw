import { ArrowShape, DiamondShape, EllipseShape, FreeDrawShape, ImageShape, LineShape, RectangleShape, TextShape } from "../types/types";

export type PointsShape = ArrowShape | LineShape | FreeDrawShape;

export type ShapeWithPoints = ArrowShape | LineShape | FreeDrawShape;

export type ShapeWithoutPoints =
  | RectangleShape
  | DiamondShape
  | EllipseShape
  | TextShape
  | ImageShape;
