import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createShapeSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<EditorStore, "shapes" | "setShapes">
> = (set) => ({
  shapes: [],
  setShapes: (updater) =>
    set(
      (state) => ({
        shapes: typeof updater === "function" ? updater(state.shapes) : updater,
      }),
      false,
      "shapes/setShapes",
    ),
});
