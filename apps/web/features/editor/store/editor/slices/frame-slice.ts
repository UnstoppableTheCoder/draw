import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createFrameSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<
    EditorStore,
    "parentFrameId" | "setParentFrameId" | "isInsideFrame" | "setIsInsideFrame"
  >
> = (set) => ({
  parentFrameId: null,
  setParentFrameId: (updater) =>
    set(
      (state) => ({
        parentFrameId:
          typeof updater === "function"
            ? updater(state.parentFrameId)
            : updater,
      }),
      false,
      "frame/setParentFrameId",
    ),

  isInsideFrame: false,
  setIsInsideFrame: (updater) =>
    set(
      (state) => ({
        isInsideFrame:
          typeof updater === "function"
            ? updater(state.isInsideFrame)
            : updater,
      }),
      false,
      "frame/setIsInsideFrame",
    ),
});
