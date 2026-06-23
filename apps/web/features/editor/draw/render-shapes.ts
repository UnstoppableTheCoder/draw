import { Point, SelectedShapeBounds, Shape } from "../types/types";
import { clearCanvas } from "./clear-canvas";
import { drawArrow } from "./draw-arrow";
import drawSelectionBounds from "./draw-selection-bounds";
import { drawDiamond } from "./draw-diamond";
import { drawEllipse } from "./draw-ellipse";
import { drawFreeDraw } from "./draw-freedraw";
import { drawImage } from "./draw-image";
import { drawLine } from "./draw-line";
import { drawRectangle } from "./draw-rectangle";
import { drawText } from "./draw-text";
import drawLineSelection from "./draw-line-selection";

export const renderShapes = ({
  ctx,
  shapes,
  previewShape,
  scale,
  panOffset,
  scaleOffset,
  bounds,
  selectedShape,
}: {
  ctx: CanvasRenderingContext2D;
  shapes: Shape[];
  previewShape?: Shape;
  scale: number;
  panOffset: Point;
  scaleOffset: Point;
  bounds?: SelectedShapeBounds | null;
  selectedShape?: Shape | null;
}) => {
  clearCanvas(ctx);

  ctx.save();
  ctx.translate(panOffset.x, panOffset.y);
  ctx.translate(scaleOffset.x, scaleOffset.y);
  ctx.scale(scale, scale);

  const allShapes = previewShape ? [...shapes, previewShape] : shapes;

  allShapes.forEach((shape) => {
    switch (shape.type) {
      case "rectangle":
        drawRectangle(ctx, shape);
        break;

      case "diamond":
        drawDiamond(ctx, shape);
        break;

      case "ellipse":
        drawEllipse(ctx, shape);
        break;

      case "arrow":
        drawArrow(ctx, shape);
        break;

      case "line":
        drawLine(ctx, shape);
        break;

      case "freedraw":
        drawFreeDraw(ctx, shape);
        break;

      case "text":
        drawText(ctx, shape);
        break;

      case "image":
        drawImage(ctx, shape);
        break;
    }
  });

  if (bounds && selectedShape) {
    if (selectedShape.type === "arrow" || selectedShape.type === "line") {
      drawLineSelection(ctx, scale, selectedShape);
    } else {
      drawSelectionBounds(ctx, scale, bounds);
    }
  }

  ctx.restore();
};
