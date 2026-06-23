export type Point = {
  x: number;
  y: number;
};

export type PointTuple = [number, number];

export type StrokeStyle = "solid" | "dashed" | "dotted";
export type FillStyle = "solid" | "hachure" | "cross-hatch" | "dots" | "zigzag";
export type Arrowhead = "arrow" | "triangle" | "bar" | "dot" | null;

export interface BoundElement {
  id: string;
  type: string;
}

export interface Binding {
  elementId: string;
  mode: "fixed" | "orbit";
  fixedPoint?: [number, number];
}

export interface Roundness {
  type: number;
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

export interface BaseShape {
  id?: string;
  type: DrawableTool;
  x: number;
  y: number;
  width?: number;
  height?: number;
  angle?: number;
  strokeColor?: string;
  backgroundColor?: string;
  fillStyle?: FillStyle;
  strokeWidth?: number;
  strokeStyle?: StrokeStyle;
  roughness?: number; // meaning ?
  opacity?: number;
  groupIds?: string[];
  frameId?: string | null;
  index?: string; // z-index
  roundness?: Roundness | null;
  seed?: number; // Random seed used by Rough.js.
  version?: number; // Increment when shape changes.
  versionNonce?: number; // Extra collision protection during syncing.
  isDeleted?: boolean;
  boundElements?: BoundElement[] | null; // Stores elements attached to this shape.
  updated?: number;
  link?: string | null; // Hyperlink attached to shape.
  locked?: boolean;
}

export interface RectangleShape extends BaseShape {
  type: "rectangle";
  width: number;
  height: number;
}

export interface DiamondShape extends BaseShape {
  type: "diamond";
  width: number;
  height: number;
}

export interface EllipseShape extends BaseShape {
  type: "ellipse";
  width: number;
  height: number;
}

export interface ArrowShape extends BaseShape {
  type: "arrow";
  points: PointTuple[];
  startBinding?: Binding | null; // Connected shape at start.
  endBinding?: Binding | null; // Connected shape at end.
  startArrowhead?: Arrowhead;
  endArrowhead?: Arrowhead;
  elbowed?: boolean; // Arrow bends at 90°.
}

export interface LineShape extends BaseShape {
  type: "line";
  points: PointTuple[];
  startBinding?: Binding | null;
  endBinding?: Binding | null;
  startArrowhead?: Arrowhead;
  endArrowhead?: Arrowhead;
  polygon?: boolean; // Used for polyline/polygon rendering.
}

export interface FreeDrawShape extends BaseShape {
  type: "freedraw";
  points: PointTuple[];
  pressures?: number[]; // Pen pressure values.
  simulatePressure?: boolean; // Fake pressure when using mouse.
}

export interface TextShape extends BaseShape {
  type: "text";
  text: string;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string; // know more
  textAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  containerId?: string | null; // Shape containing text.
  originalText?: string; // Before processing/wrapping.
  autoResize?: boolean; // Text box grows automatically.
  lineHeight?: number; // Spacing between lines.
}

export interface ImageShape extends BaseShape {
  type: "image";
  imageUrl: string;
  width: number;
  height: number;
  status?: "pending" | "saved" | "error";
  scale?: [number, number]; // Image flipping/scaling.
  crop?: CropData | null; // Stores cropped area.
}

export type Shape =
  | RectangleShape
  | DiamondShape
  | EllipseShape
  | ArrowShape
  | LineShape
  | FreeDrawShape
  | TextShape
  | ImageShape;

export type TextEditingState = {
  id?: string;
  x: number;
  y: number;
  text: string;
};

export type SelectedShapeBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type InteractionMode =
  | "idle"
  | "drawing"
  | "moving"
  | "resizing"
  | "panning"
  | "text-editing";
