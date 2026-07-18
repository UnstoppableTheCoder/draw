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

interface CreateShapeParams {
  tool: DrawableTool;
  startPoint: Point;
  endPoint: Point;
  points: PointTuple[];
  zIndex: string;
  appearance: Partial<ShapeAppearance>;
  pageId: string;
  createdById: string;
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
  pageId: string;
  createdById: string;
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
  geometry: Pick<BaseShape<any, any>, "x" | "y" | "width" | "height">,
  data: TData,
  appearance: ShapeAppearance,
  zIndex: string,
  pageId: string,
  createdById: string,
): BaseShape<TType, TData> => {
  const now = new Date().toISOString();

  return {
    // Identity
    id: uuidv4(),
    pageId,
    createdById,

    // Shape
    type,

    // Geometry
    ...geometry,
    angle: 0,

    // Appearance
    appearance,

    // Metadata
    groupId: null,
    frameId: null,
    zIndex,
    seed: Math.floor(Math.random() * 2 ** 31),
    version: 1,
    versionNonce: Math.floor(Math.random() * 2 ** 31),

    // State
    isDeleted: false,
    locked: false,

    // Misc
    link: null,

    // Shape-specific
    data,

    // Audit
    createdAt: now,
    updatedAt: now,
  };
};

// Rectangle
export const createRectangleShape = (
  start: Point,
  end: Point,
  appearance: ShapeAppearance,
  zIndex: string,
  pageId: string,
  createdById: string,
): RectangleShape =>
  createBaseShape(
    "rectangle",
    normalizeRect(start, end),
    {},
    appearance,
    zIndex,
    pageId,
    createdById,
  );

// Diamond
export const createDiamondShape = (
  start: Point,
  end: Point,
  appearance: ShapeAppearance,
  zIndex: string,
  pageId: string,
  createdById: string,
): DiamondShape =>
  createBaseShape(
    "diamond",
    normalizeRect(start, end),
    {},
    appearance,
    zIndex,
    pageId,
    createdById,
  );

// Ellipse
export const createEllipseShape = (
  start: Point,
  end: Point,
  appearance: ShapeAppearance,
  zIndex: string,
  pageId: string,
  createdById: string,
): EllipseShape =>
  createBaseShape(
    "ellipse",
    normalizeRect(start, end),
    {},
    appearance,
    zIndex,
    pageId,
    createdById,
  );

// Arrow
export const createArrowShape = (
  start: Point,
  points: PointTuple[],
  appearance: ShapeAppearance,
  zIndex: string,
  pageId: string,
  createdById: string,
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
    pageId,
    createdById,
  );

// Line
export const createLineShape = (
  start: Point,
  points: PointTuple[],
  appearance: ShapeAppearance,
  zIndex: string,
  pageId: string,
  createdById: string,
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
    pageId,
    createdById,
  );

// Free Draw
export const createFreeDrawShape = (
  start: Point,
  points: PointTuple[],
  appearance: ShapeAppearance,
  zIndex: string,
  pageId: string,
  createdById: string,
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
    pageId,
    createdById,
  );

// Frame
export const createFrameShape = ({
  rect,
  text,
  zIndex,
  appearance,
  pageId,
  createdById,
}: CreateFrameShapeParams): FrameShape => {
  const shapeAppearance: ShapeAppearance = {
    ...DEFAULT_APPEARANCE.frame,
    ...appearance,
  };

  return createBaseShape(
    "frame",
    rect,
    { text },
    shapeAppearance,
    zIndex,
    pageId,
    createdById,
  );
};

// Shape Factory
export const createShape = ({
  tool,
  startPoint,
  endPoint,
  points,
  zIndex,
  appearance,
  pageId,
  createdById,
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
        pageId,
        createdById,
      );

    case "diamond":
      return createDiamondShape(
        startPoint,
        endPoint,
        shapeAppearance,
        zIndex,
        pageId,
        createdById,
      );

    case "ellipse":
      return createEllipseShape(
        startPoint,
        endPoint,
        shapeAppearance,
        zIndex,
        pageId,
        createdById,
      );

    case "arrow":
      return createArrowShape(
        startPoint,
        points,
        shapeAppearance,
        zIndex,
        pageId,
        createdById,
      );

    case "line":
      return createLineShape(
        startPoint,
        points,
        shapeAppearance,
        zIndex,
        pageId,
        createdById,
      );

    case "freedraw":
      return createFreeDrawShape(
        startPoint,
        points,
        shapeAppearance,
        zIndex,
        pageId,
        createdById,
      );

    default:
      return null;
  }
};
