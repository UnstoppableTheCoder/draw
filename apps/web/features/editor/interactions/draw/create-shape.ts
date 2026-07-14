import { v4 as uuidv4 } from "uuid";

import { normalizeRect } from "../../geometry/normalize-rect";
import {
  ArrowShape,
  BaseShape,
  DiamondShape,
  DrawableTool,
  EllipseShape,
  FillStyle,
  FrameData,
  FrameShape,
  FreeDrawShape,
  LineShape,
  Point,
  PointTuple,
  RectangleShape,
  Shape,
  ShapeAppearance,
  ShapeType,
} from "../../types";

export interface CreateShapeParams {
  tool: DrawableTool;
  zIndex: string;
  startPoint: Point;
  endPoint: Point;
  points: PointTuple[];
  appearance?: Partial<ShapeAppearance>;
}

type CreateFrameShapeParams = {
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  text: FrameData["text"];
  zIndex: string;
  appearance?: Partial<ShapeAppearance>;
};

const DEFAULT_DRAWABLE_APPEARANCE: ShapeAppearance = {
  strokeColor: "#1e1e1e",
  backgroundColor: "transparent",
  fillStyle: "hachure",
  strokeWidth: 2,
  strokeStyle: "solid",
  roughness: 1,
  opacity: 100,
  roundness: 8,
};

export const DEFAULT_APPEARANCE = Object.freeze({
  rectangle: {
    ...DEFAULT_DRAWABLE_APPEARANCE,
  },

  diamond: {
    ...DEFAULT_DRAWABLE_APPEARANCE,
  },

  ellipse: {
    ...DEFAULT_DRAWABLE_APPEARANCE,
  },

  arrow: {
    ...DEFAULT_DRAWABLE_APPEARANCE,
    backgroundColor: "transparent",
    roundness: null,
  },

  line: {
    ...DEFAULT_DRAWABLE_APPEARANCE,
    backgroundColor: "transparent",
    roundness: null,
  },

  freedraw: {
    ...DEFAULT_DRAWABLE_APPEARANCE,
    backgroundColor: "transparent",
    roundness: null,
  },

  text: {
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 0,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    roundness: null,
  },

  image: {
    strokeColor: "transparent",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 0,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    roundness: null,
  },

  frame: {
    strokeColor: "#6965db",
    backgroundColor: "transparent",
    fillStyle: "solid" as FillStyle,
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    roundness: null,
  },
}) satisfies Record<ShapeType, ShapeAppearance>;

export const createBaseShape = <TType extends ShapeType, TData extends object>(
  type: TType,
  geometry: Pick<BaseShape<any>, "x" | "y" | "width" | "height">,
  data: TData,
  appearance: ShapeAppearance,
  zIndex: string,
): BaseShape<TType, TData> => ({
  id: uuidv4(),
  type,

  // Geometry
  ...geometry,
  angle: 0,

  // Appearance
  appearance,

  // Hierarchy
  groupId: null,
  frameId: null,

  // Ordering
  zIndex,

  // Collaboration
  seed: Math.floor(Math.random() * 2 ** 31),
  version: 1,
  versionNonce: Math.floor(Math.random() * 2 ** 31),
  updated: Date.now(),

  // State
  isDeleted: false,
  locked: false,

  // Misc
  link: null,

  // Shape-specific
  data,
});

// Rectangle
export const createRectangleShape = (
  start: Point,
  end: Point,
  appearance: ShapeAppearance,
  zIndex: string,
): RectangleShape =>
  createBaseShape(
    "rectangle",
    normalizeRect(start, end),
    {},
    appearance,
    zIndex,
  );

// Diamond
export const createDiamondShape = (
  start: Point,
  end: Point,
  appearance: ShapeAppearance,
  zIndex: string,
): DiamondShape =>
  createBaseShape("diamond", normalizeRect(start, end), {}, appearance, zIndex);

// Ellipse
export const createEllipseShape = (
  start: Point,
  end: Point,
  appearance: ShapeAppearance,
  zIndex: string,
): EllipseShape =>
  createBaseShape("ellipse", normalizeRect(start, end), {}, appearance, zIndex);

// Arrow
export const createArrowShape = (
  start: Point,
  points: PointTuple[],
  appearance: ShapeAppearance,
  zIndex: string,
): ArrowShape =>
  createBaseShape(
    "arrow",
    {
      x: start.x,
      y: start.y,
      width: 0,
      height: 0,
    },
    {
      points,
      routing: "straight",
      startBinding: null,
      endBinding: null,
    },
    appearance,
    zIndex,
  );

// Line
export const createLineShape = (
  start: Point,
  points: PointTuple[],
  appearance: ShapeAppearance,
  zIndex: string,
): LineShape =>
  createBaseShape(
    "line",
    {
      x: start.x,
      y: start.y,
      width: 0,
      height: 0,
    },
    {
      points,
      startBinding: null,
      endBinding: null,
    },
    appearance,
    zIndex,
  );

// Free Draw
export const createFreeDrawShape = (
  start: Point,
  points: PointTuple[],
  appearance: ShapeAppearance,
  zIndex: string,
): FreeDrawShape =>
  createBaseShape(
    "freedraw",
    {
      x: start.x,
      y: start.y,
      width: 0,
      height: 0,
    },
    {
      points,
    },
    appearance,
    zIndex,
  );

export const createFrameShape = ({
  rect,
  text,
  zIndex,
  appearance,
}: CreateFrameShapeParams): FrameShape => {
  const shapeAppearance: ShapeAppearance = {
    ...DEFAULT_APPEARANCE["frame"],
    ...appearance,
  };

  return createBaseShape("frame", rect, { text }, shapeAppearance, zIndex);
};

// Shape Factory
export const createShape = ({
  tool,
  startPoint,
  endPoint,
  points,
  zIndex,
  appearance,
}: CreateShapeParams): Shape | null => {
  const shapeAppearance = {
    ...DEFAULT_APPEARANCE[tool],
    ...appearance,
  };

  switch (tool) {
    case "rectangle":
      return createRectangleShape(
        startPoint,
        endPoint,
        shapeAppearance,
        zIndex,
      );

    case "diamond":
      return createDiamondShape(startPoint, endPoint, shapeAppearance, zIndex);

    case "ellipse":
      return createEllipseShape(startPoint, endPoint, shapeAppearance, zIndex);

    case "arrow":
      return createArrowShape(startPoint, points, shapeAppearance, zIndex);

    case "line":
      return createLineShape(startPoint, points, shapeAppearance, zIndex);

    case "freedraw":
      return createFreeDrawShape(startPoint, points, shapeAppearance, zIndex);

    default:
      return null;
  }
};
