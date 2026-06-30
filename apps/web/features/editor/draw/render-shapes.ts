import { Shape } from "../types/types";
import { drawArrow } from "./draw-arrow";
import { drawDiamond } from "./draw-diamond";
import { drawEllipse } from "./draw-ellipse";
import { drawFreeDraw } from "./draw-freedraw";
import { drawImage } from "./draw-image";
import { drawLine } from "./draw-line";
import { drawRectangle } from "./draw-rectangle";
import { drawText } from "./draw-text";

type Props = {
  ctx: CanvasRenderingContext2D;
  shapes: Shape[];
  skipShapeId?: string;
};

export const renderShapes = ({ ctx, shapes, skipShapeId }: Props) => {
  for (const shape of shapes) {
    if (shape.id === skipShapeId) continue;

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
  }
};
