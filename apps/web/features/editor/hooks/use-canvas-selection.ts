// import { RefObject, useState } from "react";
// import { Point, SelectedShapeBounds, Shape } from "../types/types";
// import {
//   useSelectionState,
//   useShapesState,
//   useViewportState,
// } from "../store/selectors";
// import { getShapeAtPosition } from "../utils/geometry/hit-test";
// import {
//   getBoundingBox,
//   getResizeHandleAtPoint,
// } from "../utils/geometry/bounding-box";

// export default function useCanvasSelection(isResizingRef: RefObject<boolean>) {
//   const {
//     selectedShape,
//     selectedShapeBounds,
//     setSelectedShape,
//     setSelectedShapeBounds,
//   } = useSelectionState();
//   const { shapes } = useShapesState();
//   const { scale } = useViewportState();

//   function clearSelection() {
//     setSelectedShape(null);
//     setSelectedShapeBounds(null);
//   }

//   return { clearSelection };
// }

import { useState } from "react";
import { Shape, Point, SelectedShapeBounds } from "../types/types";

import {
  getBoundingBox,
  getResizeHandleAtPoint,
} from "../geometry/bounding-box";

import { getShapeAtPosition } from "../geometry/hit-test";

export function useCanvasSelection(scale: number) {
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);

  const [selectedShapeBounds, setSelectedShapeBounds] =
    useState<SelectedShapeBounds | null>(null);

  function clearSelection() {
    setSelectedShape(null);
    setSelectedShapeBounds(null);
  }

  function selectShape(point: Point, shapes: Shape[]) {
    const shape = getShapeAtPosition(
      point,
      shapes,
      selectedShape,
      selectedShapeBounds,
    );

    if (!shape) return null;

    const bounds = getBoundingBox(shape);

    setSelectedShape(shape);
    setSelectedShapeBounds(bounds);

    const resizeHandle = getResizeHandleAtPoint(point, shape, bounds, scale);

    return {
      shape,
      bounds,
      resizeHandle,
    };
  }

  return {
    selectedShape,
    selectedShapeBounds,

    setSelectedShape,
    setSelectedShapeBounds,

    clearSelection,
    selectShape,
  };
}
