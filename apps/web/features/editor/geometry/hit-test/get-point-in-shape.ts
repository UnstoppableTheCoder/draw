import { Point } from "@/types/canvas.types";
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
  tolerance?: number,
): Shape | null => {
  switch (shape.type) {
    case "rectangle":
      return pointInRectangle(startPoint, shape, tolerance);

    case "diamond":
      return pointInDiamond(startPoint, shape, tolerance);

    case "ellipse":
      return pointInEllipse(startPoint, shape, tolerance);

    case "arrow":
      return pointInArrow(startPoint, shape, tolerance);

    case "line":
      return pointInLine(startPoint, shape, tolerance);

    case "freedraw":
      return pointInFreeDraw(startPoint, shape, tolerance);

    case "text":
      return pointInText(startPoint, shape, tolerance);

    case "image":
      return pointInImage(startPoint, shape, tolerance);

    case "frame":
      return pointInFrame(startPoint, shape, tolerance);

    default:
      return null;
  }
};
