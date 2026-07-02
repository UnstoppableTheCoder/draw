import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createEraserSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<EditorStore, "eraserPoints" | "setEraserPoints">
> = (set) => ({
  eraserPoints: [],
  setEraserPoints: (updater) =>
    set(
      (state) => ({
        eraserPoints:
          typeof updater === "function" ? updater(state.eraserPoints) : updater,
      }),
      false,
      "eraser/setEraserPoints",
    ),
});
