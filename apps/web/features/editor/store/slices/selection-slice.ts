import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createSelectionSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<
    EditorStore,
    | "selectedShape"
    | "setSelectedShape"
    | "selectedShapeBounds"
    | "setSelectedShapeBounds"
  >
> = (set) => ({
  selectedShape: null,
  setSelectedShape: (updater) =>
    set(
      (state) => ({
        selectedShape:
          typeof updater === "function"
            ? updater(state.selectedShape)
            : updater,
      }),
      false,
      "selection/setSelectedShape",
    ),

  selectedShapeBounds: null,
  setSelectedShapeBounds: (bounds) =>
    set(
      {
        selectedShapeBounds: bounds,
      },
      false,
      "selection/setSelectedShapeBounds",
    ),
});
