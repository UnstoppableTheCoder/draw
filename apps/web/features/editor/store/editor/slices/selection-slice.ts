import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createSelectionSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<
    EditorStore,
    | "selectedShapesIds"
    | "setSelectedShapesIds"
    | "selectionBounds"
    | "setSelectionBounds"
    | "selectedGroupsIds"
    | "setSelectedGroupsIds"
    | "frames"
    | "setFrames"
  >
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

  selectionBounds: null,
  setSelectionBounds: (bounds) =>
    set(
      {
        selectionBounds: bounds,
      },
      false,
      "selection/setSelectionBounds",
    ),

  // #################### Not Being Used #######################
  selectedGroupsIds: [],
  setSelectedGroupsIds: (updater) =>
    set(
      (state) => ({
        selectedGroupsIds:
          typeof updater === "function"
            ? updater(state.selectedGroupsIds)
            : updater,
      }),
      false,
      "selection/setSelectedGroupsIds",
    ),

  // #################### Not Being Used #######################
  frames: [],
  setFrames: (updater) =>
    set(
      (state) => ({
        frames: typeof updater === "function" ? updater(state.frames) : updater,
      }),
      false,
      "selection/setFramesIds",
    ),
});
