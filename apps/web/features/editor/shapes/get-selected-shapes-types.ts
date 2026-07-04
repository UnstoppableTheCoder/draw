import { Shape } from "../types/types";

export default function getSelectedShapesTypes(selectedShapes: Shape[]) {
  const selectedShapesTypes = new Set();

  for (const shape of selectedShapes) {
    selectedShapesTypes.add(shape.type);
  }

  return selectedShapesTypes;
}
