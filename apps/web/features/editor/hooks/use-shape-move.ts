import { getBoundingBox } from "../geometry/bounding-box";
import { Shape } from "../types/types";
import * as store from "../store/selectors";

export default function useShapeMove() {
  const setShapes = store.useSetShapes();
  const setSelectedShape = store.useSetSelectedShape();
  const setSelectedShapeBounds = store.useSetSelectedShapeBounds();

  const moveShape = ({
    selectedShape,
    dx,
    dy,
  }: {
    selectedShape: Shape;
    dx: number;
    dy: number;
  }) => {
    const updatedShape = {
      ...selectedShape,
      x: selectedShape.x + dx,
      y: selectedShape.y + dy,
    };

    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === selectedShape.id ? updatedShape : shape,
      ),
    );

    setSelectedShape(updatedShape);
    setSelectedShapeBounds(getBoundingBox(updatedShape));
  };

  return { moveShape };
}
