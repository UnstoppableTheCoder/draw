import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EditorStore } from "./editor-types";
import { Point } from "../types/types";

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set) => ({
      // Tool
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

      // Interactions
      interactionMode: "idle",
      setInteractionMode: (mode) =>
        set(
          {
            interactionMode: mode,
          },
          false,
          "interaction/setInteractionMode",
        ),

      // Shapes
      shapes: [],
      setShapes: (updater) =>
        set(
          (state) => ({
            shapes:
              typeof updater === "function" ? updater(state.shapes) : updater,
          }),
          false,
          "shapes/setShapes",
        ),

      // Selection
      selectedShape: null,
      setSelectedShape: (updater) =>
        set(
          (state) => ({
            selectedShape:
              typeof updater === "function"
                ? updater(state.selectedShape)
                : updater,
          }),
          false,
          "selection/setSelectedShape",
        ),

      selectedShapeBounds: null,
      setSelectedShapeBounds: (bounds) =>
        set(
          {
            selectedShapeBounds: bounds,
          },
          false,
          "selection/setSelectedShapeBounds",
        ),

      // Text Editing
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

      // Viewport
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
              typeof updater === "function"
                ? updater(state.panOffset)
                : updater,
          }),
          false,
          "viewport/setPanOffset",
        ),

      scaleOffset: { x: 0, y: 0 },
      setScaleOffset: (offset: Point) =>
        set(
          {
            scaleOffset: offset,
          },
          false,
          "viewport/setScaleOffset",
        ),

      // History
      history: [],
      setHistory: (updater) =>
        set(
          (state) => ({
            history:
              typeof updater === "function" ? updater(state.history) : updater,
          }),
          false,
          "history/setHistory",
        ),

      redoStack: [],
      setRedoStack: (updater) =>
        set(
          (state) => ({
            redoStack:
              typeof updater === "function"
                ? updater(state.redoStack)
                : updater,
          }),
          false,
          "history/setRedoStack",
        ),

      // Text Style
      fontSize: 20,
      setFontSize: (size) =>
        set(
          {
            fontSize: size,
          },
          false,
          "textStyle/setFontSize",
        ),

      fontFamily: "Arial",
      setFontFamily: (family) =>
        set(
          {
            fontFamily: family,
          },
          false,
          "textStyle/setFontFamily",
        ),

      lineHeightMultiplier: 1.2,
      setLineHeightMultiplier: (value) =>
        set(
          {
            lineHeightMultiplier: value,
          },
          false,
          "textStyle/setLineHeightMultiplier",
        ),
    }),
    {
      name: "editor-store",
    },
  ),
);
