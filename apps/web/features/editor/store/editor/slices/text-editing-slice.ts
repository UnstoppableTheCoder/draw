import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createTextEditingSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<EditorStore, "textEditingState" | "setTextEditingState">
> = (set) => ({
  textEditingState: null,
  setTextEditingState: (updater) =>
    set(
      (state) => ({
        textEditingState:
          typeof updater === "function"
            ? updater(state.textEditingState)
            : updater,
      }),
      false,
      "text/setTextEditingState",
    ),
});
