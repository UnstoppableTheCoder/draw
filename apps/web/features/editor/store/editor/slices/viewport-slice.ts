import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createViewportSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<
    EditorStore,
    | "scale"
    | "setScale"
    | "panOffset"
    | "setPanOffset"
    | "scaleOffset"
    | "setScaleOffset"
  >
> = (set) => ({
  scale: 1,
  setScale: (scale) =>
    set(
      {
        scale,
      },
      false,
      "viewport/setScale",
    ),

  panOffset: { x: 0, y: 0 },
  setPanOffset: (updater) =>
    set(
      (state) => ({
        panOffset:
          typeof updater === "function" ? updater(state.panOffset) : updater,
      }),
      false,
      "viewport/setPanOffset",
    ),

  scaleOffset: { x: 0, y: 0 },
  setScaleOffset: (offset) =>
    set(
      {
        scaleOffset: offset,
      },
      false,
      "viewport/setScaleOffset",
    ),
});
