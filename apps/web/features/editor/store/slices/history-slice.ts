import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";
import { MAX_HISTORY } from "../../constants/history";

export const createHistorySlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<EditorStore, "undoStack" | "redoStack" | "undo" | "redo" | "pushHistory">
> = (set) => ({
  undoStack: [],
  redoStack: [],

  pushHistory: () =>
    set(
      (state) => {
        const undoStack = [...state.undoStack, structuredClone(state.shapes)];

        return {
          undoStack:
            undoStack.length > MAX_HISTORY
              ? undoStack.slice(-MAX_HISTORY)
              : undoStack,
          redoStack: [],
        };
      },
      false,
      "history/pushHistory",
    ),

  undo: () =>
    set(
      (state) => {
        if (state.undoStack.length === 0) return state;

        const previous = state.undoStack[state.undoStack.length - 1];

        return {
          shapes: structuredClone(previous),
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, structuredClone(state.shapes)],
        };
      },
      false,
      "history/undo",
    ),

  redo: () =>
    set(
      (state) => {
        if (state.redoStack.length === 0) return state;

        const next = state.redoStack[state.redoStack.length - 1];

        return {
          shapes: structuredClone(next),
          redoStack: state.redoStack.slice(0, -1),
          undoStack: [...state.undoStack, structuredClone(state.shapes)],
        };
      },
      false,
      "history/redo",
    ),
});
