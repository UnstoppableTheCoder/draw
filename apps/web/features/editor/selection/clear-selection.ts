import { Dispatch, SetStateAction } from "react";
import { SelectedShapeBounds, Shape } from "../types/types";

export function clearSelection(
  setSelectedShape: Dispatch<SetStateAction<Shape | null>>,
  setSelectedShapeBounds: Dispatch<SetStateAction<SelectedShapeBounds | null>>,
) {
  setSelectedShape(null);
  setSelectedShapeBounds(null);
}
