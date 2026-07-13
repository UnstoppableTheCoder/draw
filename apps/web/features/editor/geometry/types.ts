import { ArrowShape, DiamondShape, EllipseShape, FrameShape, FreeDrawShape, ImageShape, LineShape, RectangleShape, TextShape } from "../types";

export type PointsShape = ArrowShape | LineShape | FreeDrawShape;

export type ShapeWithPoints = ArrowShape | LineShape | FreeDrawShape;

export type ShapeWithoutPoints =
  | RectangleShape
  | DiamondShape
  | EllipseShape
  | TextShape
  | ImageShape
  | FrameShape;
