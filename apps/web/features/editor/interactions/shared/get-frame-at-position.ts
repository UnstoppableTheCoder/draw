import { getPointInShape } from "../../geometry/hit-test/get-point-in-shape";
import { Point, Shape } from "../../types";

export const getFrameAtPosition = ({
  point,
  shapes,
  scale,
}: {
  point: Point;
  shapes: Shape[];
  scale: number;
}): Shape | null => {
  for (let i = shapes.length; i >= 0; i--) {
    const shape = shapes[i];
    if (!shape) continue;

    const hitShape = getPointInShape(point, shape, scale);

    if (hitShape && hitShape.type === "frame") {
      return hitShape;
    }
  }

  return null;
};
