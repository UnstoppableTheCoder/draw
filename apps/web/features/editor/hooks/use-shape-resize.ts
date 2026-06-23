import { RefObject } from "react";
import { Point, PointTuple, SelectedShapeBounds, Shape } from "../types/types";
import { ResizeHandleType } from "../types/resize-handle";
import { TOLERANCE } from "../constants/canvas";
import { normalizeRect } from "../utils/normalize-rect";
import { resizeFreeDrawShape } from "../resize/resize-freedraw";
import { getBoundingBox } from "../geometry/bounding-box";
import * as store from "../store/selectors";

export default function useShapeResize({
  resizableHandleRef,
  lineResizeStateRef,
  resizeStartBoundsRef,
  freeDrawShapePointsRef,
}: {
  resizableHandleRef: RefObject<ResizeHandleType | null>;
  lineResizeStateRef: RefObject<{ start: Point; end: Point } | null>;
  resizeStartBoundsRef: RefObject<SelectedShapeBounds | null>;
  freeDrawShapePointsRef: RefObject<PointTuple[]>;
}) {
  const setShapes = store.useSetShapes();
  const setSelectedShape = store.useSetSelectedShape();
  const setSelectedShapeBounds = store.useSetSelectedShapeBounds();

  const resizeShape = (selectedShape: Shape, currentPoint: Point) => {
    if (selectedShape.type === "arrow" || selectedShape.type === "line") {
      const handle = resizableHandleRef.current;
      const resizeState = lineResizeStateRef.current;

      if (!handle || !resizeState) {
        return;
      }

      let updatedShape: Shape = {
        ...selectedShape,
      };

      switch (handle) {
        case "start": {
          const fixedEnd = resizeState.end;

          updatedShape = {
            ...selectedShape,
            x: currentPoint.x,
            y: currentPoint.y,
            points: [
              [0, 0],
              [fixedEnd.x - currentPoint.x, fixedEnd.y - currentPoint.y],
            ],
          };

          break;
        }

        case "end": {
          const fixedStart = resizeState.start;

          updatedShape = {
            ...selectedShape,
            x: fixedStart.x, // You can skip setting x & y here because they are already set
            y: fixedStart.y,
            points: [
              [0, 0],
              [currentPoint.x - fixedStart.x, currentPoint.y - fixedStart.y],
            ],
          };

          break;
        }

        default:
          return;
      }

      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === selectedShape.id ? updatedShape : shape,
        ),
      );

      setSelectedShape(updatedShape);
      setSelectedShapeBounds(getBoundingBox(updatedShape));
      return;
    }

    const bounds = resizeStartBoundsRef.current;
    if (!bounds || !resizableHandleRef.current) return;

    let { minX, minY, maxX, maxY } = bounds;

    // Removing the Tolerance here because for cursor click it was added when getting the boundingBox
    minX = minX + TOLERANCE;
    minY = minY + TOLERANCE;
    maxX = maxX - TOLERANCE;
    maxY = maxY - TOLERANCE;

    let start: Point;
    let end: Point;

    switch (resizableHandleRef.current) {
      case "top":
        start = {
          x: minX,
          y: currentPoint.y,
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
          y: currentPoint.y,
        };
        break;

      case "left":
        start = {
          x: currentPoint.x,
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
          x: currentPoint.x,
          y: maxY,
        };
        break;

      case "top-left":
        start = currentPoint;

        end = {
          x: maxX,
          y: maxY,
        };
        break;

      case "top-right":
        start = {
          x: minX,
          y: currentPoint.y,
        };

        end = {
          x: currentPoint.x,
          y: maxY,
        };
        break;

      case "bottom-left":
        start = {
          x: currentPoint.x,
          y: minY,
        };

        end = {
          x: maxX,
          y: currentPoint.y,
        };
        break;

      case "bottom-right":
        start = {
          x: minX,
          y: minY,
        };

        end = currentPoint;
        break;

      default:
        return;
    }

    const rect = normalizeRect(start, end);

    if (selectedShape.type === "freedraw") {
      const updatedShape = resizeFreeDrawShape({
        selectedShape,
        rect,
        resizeStartBoundsRef,
        freeDrawShapePointsRef,
      });
      if (!updatedShape) return;

      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === selectedShape.id ? updatedShape : shape,
        ),
      );

      setSelectedShape(updatedShape);
      setSelectedShapeBounds(getBoundingBox(updatedShape));
      return;
    }

    const updatedShape = {
      ...selectedShape,
      ...rect,
    };

    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === selectedShape.id ? updatedShape : shape,
      ),
    );

    setSelectedShape(updatedShape);
    setSelectedShapeBounds(getBoundingBox(updatedShape));
  };

  return {
    resizeShape,
  };
}
