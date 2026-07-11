import { Point } from "@/types/canvas";
import { pointInArrow } from "./shapes/arrow";
import { pointInDiamond } from "./shapes/diamond";
import { pointInEllipse } from "./shapes/ellipse";
import { pointInFreeDraw } from "./shapes/freedraw";
import { pointInImage } from "./shapes/image";
import { pointInLine } from "./shapes/line";
import { pointInRectangle } from "./shapes/rectangle";
import { pointInText } from "./shapes/text";
import { Shape } from "../../types/types";
import { pointInFrame } from "./shapes/frame";

export const getPointInShape = (
  startPoint: Point,
  shape: Shape,
  scale: number,
  tolerance?: number,
): Shape | null => {
  switch (shape.type) {
    case "rectangle":
      return pointInRectangle(startPoint, shape, scale, tolerance);

    case "diamond":
      return pointInDiamond(startPoint, shape, scale, tolerance);

    case "ellipse":
      return pointInEllipse(startPoint, shape, scale, tolerance);

    case "arrow":
      return pointInArrow(startPoint, shape, scale, tolerance);

    case "line":
      return pointInLine(startPoint, shape, scale, tolerance);

    case "freedraw":
      return pointInFreeDraw(startPoint, shape, scale, tolerance);

    case "text":
      return pointInText(startPoint, shape, scale, tolerance);

    case "image":
      return pointInImage(startPoint, shape, scale, tolerance);

    case "frame":
      return pointInFrame(startPoint, shape, scale, tolerance);

    default:
      return null;
  }
};
