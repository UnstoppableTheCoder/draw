import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createSelectionSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<EditorStore, "selectedShapesIds" | "setSelectedShapesIds">
> = (set) => ({
  selectedShapesIds: [],
  setSelectedShapesIds: (updater) =>
    set(
      (state) => ({
        selectedShapesIds:
          typeof updater === "function"
            ? updater(state.selectedShapesIds)
            : updater,
      }),
      false,
      "selection/setSelectedShapesIds",
    ),
});
