import {
  Arrowhead,
  ArrowRouting,
  Binding,
  CropData,
  DrawableTool,
  FillStyle,
  PointTuple,
  StrokeStyle,
  TextAlign,
} from "./types";

export type ShapeType = DrawableTool | "frame";

// Shared Shape Types
export interface ShapeAppearance {
  strokeColor: string;
  backgroundColor: string;
  fillStyle: FillStyle;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  roughness: number;
  opacity: number;
  roundness: number | null;
}

// Shape Data
export interface RectangleData {}
export interface DiamondData {}
export interface EllipseData {}
export interface ArrowData {
  points: PointTuple[];
  routing?: ArrowRouting;
  startBinding?: Binding | null;
  endBinding?: Binding | null;
  startArrowhead?: Arrowhead;
  endArrowhead?: Arrowhead;
}

export interface LineData {
  points: PointTuple[];
  startBinding?: Binding | null;
  endBinding?: Binding | null;
  startArrowhead?: Arrowhead;
  endArrowhead?: Arrowhead;
  polygon?: boolean;
}

export interface FreeDrawData {
  points: PointTuple[];
  pressures?: number[];
  pressureMode?: "real" | "simulated";
}

export interface TextData {
  text: string;
  fontSize: number;
  fontFamily: string;
  textAlign?: TextAlign;
  verticalAlign?: "top" | "middle" | "bottom";
  containerId?: string | null;
  originalText?: string;
  autoResize?: boolean;
  lineHeight?: number;
}

export interface ImageData {
  imageId: string;
  scale?: [number, number];
  crop?: CropData | null;
}

export interface FrameData {
  text: {
    name: string;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
  };
}

// Base Shape
export interface BaseShape<TType extends ShapeType, TData = unknown> {
  id: string;
  type: TType;

  // Geometry
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;

  // Appearance
  appearance: ShapeAppearance;

  // Hierarchy
  groupId: string | null;
  frameId: string | null;

  // Ordering
  zIndex: string;

  // Collaboration
  seed: number;
  version: number;
  versionNonce: number;
  updated: number;

  // State
  isDeleted: boolean;
  locked: boolean;

  // Misc
  link: string | null;

  // Shape-specific
  data: TData;
}

// Shapes
export type RectangleShape = BaseShape<"rectangle", RectangleData>;
export type DiamondShape = BaseShape<"diamond", DiamondData>;
export type EllipseShape = BaseShape<"ellipse", EllipseData>;
export type ArrowShape = BaseShape<"arrow", ArrowData>;
export type LineShape = BaseShape<"line", LineData>;
export type FreeDrawShape = BaseShape<"freedraw", FreeDrawData>;
export type TextShape = BaseShape<"text", TextData>;
export type ImageShape = BaseShape<"image", ImageData>;
export type FrameShape = BaseShape<"frame", FrameData>;

// Union
export type Shape =
  | RectangleShape
  | DiamondShape
  | EllipseShape
  | ArrowShape
  | LineShape
  | FreeDrawShape
  | TextShape
  | ImageShape
  | FrameShape;
