import { ToolType } from "@/types/toolbar.types";
import { renderShapes } from "./render-shapes";
import { createShape } from "../shapes/create-shape";
import { Point, PointTuple, Shape } from "../types/types";
import { RefObject } from "react";

type RenderPreviewShapeProps = {
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  tool: ToolType;
  startPoint: Point;
  endPoint: Point;
  points: PointTuple[];
  shapes: Shape[];
};

export const renderPreviewShape = ({
  overlayCanvasRef,
  tool,
  startPoint,
  endPoint,
  points,
  shapes,
}: RenderPreviewShapeProps) => {
  const previewShape = createShape({
    tool,
    startPoint,
    endPoint,
    points,
  });

  const ctx = overlayCanvasRef.current?.getContext("2d");
  if (!previewShape || !ctx) return;

  renderShapes({
    ctx,
    shapes,
  });
};
