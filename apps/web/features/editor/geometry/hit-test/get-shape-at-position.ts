import { Point } from "@/types/canvas";
import { Shape } from "../../types/types";
import { getBoundingBox } from "../bounding-box/get-bounding-box";
import { isPointInSelectedShapeBounds } from "./is-point-in-selected-bounds";
import { getPointInShape } from "./get-point-in-shape";

export const getShapeAtPosition = ({
  point,
  shapes,
  scale,
  selectedShape,
}: {
  point: Point;
  shapes: Shape[];
  scale: number;
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

    const hitShape = getPointInShape(point, shape, scale);

    if (hitShape) {
      return hitShape;
    }
  }

  return null;
};
