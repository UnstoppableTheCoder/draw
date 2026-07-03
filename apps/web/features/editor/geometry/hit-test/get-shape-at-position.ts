import { Point } from "@/types/canvas.types";
import { Shape } from "../../types/types";
import { getBoundingBox } from "../bounding-box/get-bounding-box";
import { isPointInSelectedShapeBounds } from "./is-point-in-selected-bounds";
import { getPointInShape } from "./get-point-in-shape";

export const getShapeAtPosition = ({
  point,
  shapes,
  selectedShape,
}: {
  point: Point;
  shapes: Shape[];
  selectedShape?: Shape | null;
}): Shape | null => {
  if (selectedShape) {
    const selectedShapeBounds = getBoundingBox(selectedShape);

    if (isPointInSelectedShapeBounds(point, selectedShapeBounds)) {
      return selectedShape;
    }
  }

  for (let i = shapes.length; i >= 0; i--) {
    const shape = shapes[i];
    if (!shape) continue;

    const hitShape = getPointInShape(point, shape);

    if (hitShape) {
      return hitShape;
    }
  }

  return null;
};
