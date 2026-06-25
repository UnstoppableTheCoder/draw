import { getPointInShape } from "../geometry/hit-test";
import { useSetShapes, useShapes } from "../store/selectors";
import { Point } from "../types/types";

export default function useCanvasEraser() {
  const shapes = useShapes();
  const setShapes = useSetShapes();

  function deleteShape(hitShapeId: string) {
    setShapes((prevShapes) =>
      prevShapes.filter((shape) => shape.id !== hitShapeId),
    );
  }

  function onPointerMove(point: Point) {
    for (const shape of shapes) {
      const hitShape = getPointInShape(point, shape);

      if (hitShape && hitShape.id) {
        deleteShape(hitShape.id);
      }
    }
  }

  return {
    onPointerMove,
  };
}
