import { TextShape } from "./shape";

export type Point = {
  x: number;
  y: number;
};

export type PointTuple = [number, number];

export type StrokeStyle = "solid" | "dashed" | "dotted";
export type FillStyle = "solid" | "hachure" | "cross-hatch" | "dots" | "zigzag";
export type Arrowhead = "arrow" | "triangle" | "bar" | "dot" | null;

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
  | "circle"
  | "ellipse"
  | "diamond"
  | "line"
  | "arrow"
  | "freedraw"
  | "text"
  | "image";

export interface TextEditingState extends Omit<
  TextShape,
  "id" | "fontSize" | "fontFamily"
> {
  id?: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
}

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
