import { ShapeAppearance, TextData, TextShape } from "./shape";

export type Point = {
  x: number;
  y: number;
};

export type PointTuple = [number, number];

export type StrokeStyle = "solid" | "dashed" | "dotted";
export type FillStyle = "solid" | "hachure" | "cross-hatch" | "dots" | "zigzag";
export type Arrowhead = "arrow" | "triangle" | "bar" | "dot" | null;
export type ArrowRouting = "straight" | "elbow" | "curved" | "smart";

export type TextAlign = "left" | "center" | "right";

export interface BoundElement {
  id: string;
  type: string;
}

export interface Binding {
  elementId: string;
  mode: "fixed" | "orbit";
  fixedPoint?: [number, number];
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DrawableTool =
  | "rectangle"
  | "ellipse"
  | "diamond"
  | "line"
  | "arrow"
  | "freedraw"
  | "text"
  | "image";

export type TextEditingState = {
  // Identity
  id?: string;
  pageId: string;
  createdById: string;

  // Shape
  type: "text";

  // Geometry
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;

  // Appearance
  appearance: ShapeAppearance;

  // Metadata
  groupId: string | null;
  frameId: string | null;
  seed: number;
  version: number;
  versionNonce: number;

  // State
  isDeleted: boolean;
  locked: boolean;

  // Misc
  link: string | null;

  // Shape-specific
  data: TextData;
};

export type SelectedBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type EraserPoint = Point & {
  time: number;
};

export type FrameEditingState = {
  frameId: string;
  frameName: string;
};
