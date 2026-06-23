import { create } from "zustand";
import { EditorStore } from "./editor-types";
import { Point } from "../types/types";

export const useEditorStore = create<EditorStore>((set) => ({
  // Tool
  selectedTool: "select",
  setSelectedTool: (tool) =>
    set({
      selectedTool: tool,
    }),

  lockTool: false,
  setLockTool: (lock) =>
    set({
      lockTool: lock,
    }),

  // Interactions
  interactionMode: "idle",
  setInteractionMode: (mode) =>
    set({
      interactionMode: mode,
    }),

  // Shapes
  shapes: [],
  setShapes: (updater) =>
    set((state) => ({
      shapes: typeof updater === "function" ? updater(state.shapes) : updater,
    })),

  // Selection
  selectedShape: null,
  setSelectedShape: (shape) =>
    set({
      selectedShape: shape,
    }),

  selectedShapeBounds: null,
  setSelectedShapeBounds: (bounds) =>
    set({
      selectedShapeBounds: bounds,
    }),

  // Text Editing
  textEditingState: null,
  setTextEditingState: (updater) =>
    set((state) => ({
      textEditingState:
        typeof updater === "function"
          ? updater(state.textEditingState)
          : updater,
    })),

  // Viewport
  scale: 1,
  setScale: (scale) =>
    set({
      scale,
    }),

  panOffset: {
    x: 0,
    y: 0,
  },
  setPanOffset: (offset: Point) =>
    set({
      panOffset: offset,
    }),

  scaleOffset: {
    x: 0,
    y: 0,
  },
  setScaleOffset: (offset: Point) =>
    set({
      scaleOffset: offset,
    }),

  // History
  history: [],
  setHistory: (updater) =>
    set((state) => ({
      history: typeof updater === "function" ? updater(state.history) : updater,
    })),

  redoStack: [],
  setRedoStack: (updater) =>
    set((state) => ({
      redoStack:
        typeof updater === "function" ? updater(state.redoStack) : updater,
    })),

  // Text Style
  fontSize: 20,
  setFontSize: (size) =>
    set({
      fontSize: size,
    }),

  fontFamily: "Arial",
  setFontFamily: (family) =>
    set({
      fontFamily: family,
    }),

  lineHeightMultiplier: 1.2,
  setLineHeightMultiplier: (value) =>
    set({
      lineHeightMultiplier: value,
    }),
}));
