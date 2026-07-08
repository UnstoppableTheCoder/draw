import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createFrameSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<EditorStore, "hoveredFrameId" | "setHoveredFrameId">
> = (set) => ({
  hoveredFrameId: null,
  setHoveredFrameId: (updater) =>
    set(
      (state) => ({
        hoveredFrameId:
          typeof updater === "function"
            ? updater(state.hoveredFrameId)
            : updater,
      }),
      false,
      "frame/setParentFrameId",
    ),
});
