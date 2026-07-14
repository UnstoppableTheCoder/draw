import { ArrowShape, LineShape, Point } from "../../types";
import { ResizeHandleType } from "../../types/resize-handle";

type LinearShape = LineShape | ArrowShape;

export function resizeLineShape({
  shape,
  currentPoint,
  handle,
  lineResizeState,
}: {
  shape: LinearShape;
  currentPoint: Point;
  handle: ResizeHandleType;
  lineResizeState: {
    start: Point;
    end: Point;
  };
}): LinearShape {
  switch (handle) {
    case "start": {
      const { end } = lineResizeState;

      return {
        ...shape,
        x: currentPoint.x,
        y: currentPoint.y,
        data: {
          ...shape.data,
          points: [
            [0, 0],
            [end.x - currentPoint.x, end.y - currentPoint.y],
          ],
        },
      };
    }

    case "end": {
      const { start } = lineResizeState;

      return {
        ...shape,
        x: start.x,
        y: start.y,
        data: {
          ...shape.data,
          points: [
            [0, 0],
            [currentPoint.x - start.x, currentPoint.y - start.y],
          ],
        },
      };
    }

    default:
      return shape;
  }
}
