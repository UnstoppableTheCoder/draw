import { ToolType } from "@/types/toolbar.types";
import { renderShapes } from "./render-shapes";
import { createShape } from "../shapes/create-shape";
import { Point, PointTuple, Shape } from "../types/types";

type RenderPreviewShapeProps = {
  ctx: CanvasRenderingContext2D;
  tool: ToolType;
  startPoint: Point;
  endPoint: Point;
  points: PointTuple[];
  shapes: Shape[];
  scale: number;
  panOffset: Point;
  scaleOffset: Point;
};

export const renderPreviewShape = ({
  ctx,
  tool,
  startPoint,
  endPoint,
  points,
  shapes,
  scale,
  panOffset,
  scaleOffset,
}: RenderPreviewShapeProps) => {
  const previewShape = createShape({
    tool,
    startPoint,
    endPoint,
    points,
  });

  if (!previewShape) return;

  renderShapes({
    ctx,
    shapes,
    previewShape,
    scale,
    panOffset,
    scaleOffset,
  });
};
