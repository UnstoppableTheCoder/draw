import { TOLERANCE } from "../../constants/canvas";
import { ResizeHandleType } from "../../types/resize-handle";
import { Point, SelectedBounds } from "../../types/types";
import { normalizeRect } from "../../geometry/normalize-rect";

export const getResizeRect = ({
  handle,
  currentPoint,
  initialBounds,
}: {
  handle: ResizeHandleType;
  currentPoint: Point;
  initialBounds: SelectedBounds;
}) => {
  let { minX, minY, maxX, maxY } = initialBounds;

  minX += TOLERANCE;
  minY += TOLERANCE;
  maxX -= TOLERANCE;
  maxY -= TOLERANCE;

  let start: Point;
  let end: Point;

  switch (handle) {
    case "top":
      start = {
        x: minX,
        y: currentPoint.y + TOLERANCE,
      };

      end = {
        x: maxX,
        y: maxY,
      };
      break;

    case "bottom":
      start = {
        x: minX,
        y: minY,
      };

      end = {
        x: maxX,
        y: currentPoint.y - TOLERANCE,
      };
      break;

    case "left":
      start = {
        x: currentPoint.x + TOLERANCE,
        y: minY,
      };

      end = {
        x: maxX,
        y: maxY,
      };
      break;

    case "right":
      start = {
        x: minX,
        y: minY,
      };

      end = {
        x: currentPoint.x - TOLERANCE,
        y: maxY,
      };
      break;

    case "top-left":
      start = { x: currentPoint.x + TOLERANCE, y: currentPoint.y + TOLERANCE };

      end = {
        x: maxX,
        y: maxY,
      };
      break;

    case "top-right":
      start = {
        x: minX,
        y: currentPoint.y + TOLERANCE,
      };

      end = {
        x: currentPoint.x - TOLERANCE,
        y: maxY,
      };
      break;

    case "bottom-left":
      start = {
        x: currentPoint.x + TOLERANCE,
        y: minY,
      };

      end = {
        x: maxX,
        y: currentPoint.y - TOLERANCE,
      };
      break;

    case "bottom-right":
      start = {
        x: minX,
        y: minY,
      };

      end = { x: currentPoint.x - TOLERANCE, y: currentPoint.y - TOLERANCE };
      break;

    default:
      return;
  }

  const rect = normalizeRect(start, end);
  return rect;
};
  