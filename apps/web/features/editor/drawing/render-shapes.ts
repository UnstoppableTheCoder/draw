import { useImageManager } from "../interactions/manager/image-manager";
import { Shape } from "../types";
import { FrameEditingState } from "../types/types";
import { drawArrow } from "./shapes/arrow";
import { drawDiamond } from "./shapes/diamond";
import { drawEllipse } from "./shapes/ellipse";
import { drawFrame } from "./shapes/frame";
import { drawFreeDraw } from "./shapes/freedraw";
import { drawImage } from "./shapes/image";
import { drawLine } from "./shapes/line";
import { drawRectangle } from "./shapes/rectangle";
import { drawText } from "./shapes/text";

type Props = {
  ctx: CanvasRenderingContext2D;
  shapes: Shape[];
  scale: number;
  skipShapeIds?: Set<string>;
  hoveredFrameId?: string | null;
  frameEditingState: FrameEditingState | null;
  imageManager: ReturnType<typeof useImageManager>;
};

export const renderShapes = ({
  ctx,
  shapes,
  scale,
  skipShapeIds,
  hoveredFrameId,
  frameEditingState,
  imageManager,
}: Props) => {
  for (const shape of shapes) {
    if (skipShapeIds?.has(shape.id)) continue;

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
        drawImage(ctx, shape, imageManager);
        break;

      case "frame":
        drawFrame(
          ctx,
          shape,
          scale,
          hoveredFrameId === shape.id,
          frameEditingState && frameEditingState.frameId === shape.id
            ? true
            : false,
        );
        break;
    }
  }
};
