import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createSelectionSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<
    EditorStore,
    | "selectedShapeIds"
    | "setSelectedShapeIds"
    | "selectionBounds"
    | "setSelectionBounds"
  >
> = (set) => ({
  selectedShapeIds: [],
  setSelectedShapeIds: (updater) =>
    set(
      (state) => ({
        selectedShapeIds:
          typeof updater === "function"
            ? updater(state.selectedShapeIds)
            : updater,
      }),
      false,
      "selection/setSelectedShapeIds",
    ),

  selectionBounds: null,
  setSelectionBounds: (bounds) =>
    set(
      {
        selectionBounds: bounds,
      },
      false,
      "selection/setSelectionBounds",
    ),
});
