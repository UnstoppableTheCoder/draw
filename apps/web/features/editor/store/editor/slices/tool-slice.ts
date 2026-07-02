import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createToolSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<
    EditorStore,
    "selectedTool" | "setSelectedTool" | "isLocked" | "setIsLocked"
  >
> = (set) => ({
  selectedTool: "select",
  setSelectedTool: (tool) =>
    set(
      {
        selectedTool: tool,
      },
      false,
      "tool/setSelectedTool",
    ),

  isLocked: false,
  setIsLocked: (lock) =>
    set(
      {
        isLocked: lock,
      },
      false,
      "tool/setIsLocked",
    ),
});
