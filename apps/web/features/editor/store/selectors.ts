// store/selectors.ts

import { useEditorStore } from "./editor-store";

/* =========================
   Tools
========================= */
export function useToolState() {
  return useEditorStore((state) => ({
    selectedTool: state.selectedTool,
    setSelectedTool: state.setSelectedTool,
    lockTool: state.lockTool,
    setLockTool: state.setLockTool,
  }));
}

export function useCursor() {
  const selectedTool = useEditorStore((state) => state.selectedTool);

  switch (selectedTool) {
    case "text":
      return "text";

    case "rectangle":
    case "ellipse":
    case "line":
    case "arrow":
      return "crosshair";

    default:
      return "default";
  }
}

/* =========================
   Shapes
========================= */
export function useShapesState() {
  return useEditorStore((state) => ({
    shapes: state.shapes,
    setShapes: state.setShapes,
  }));
}

/* =========================
   Selection
========================= */
export function useSelectionState() {
  return useEditorStore((state) => ({
    selectedShape: state.selectedShape,
    setSelectedShape: state.setSelectedShape,
    selectedShapeBounds: state.selectedShapeBounds,
    setSelectedShapeBounds: state.setSelectedShapeBounds,
  }));
}

/* =========================
   Text Editing
========================= */
export function useTextEditingState() {
  return useEditorStore((state) => ({
    textEditingState: state.textEditingState,
    setTextEditingState: state.setTextEditingState,
  }));
}

/* =========================
   Viewport
========================= */
export function useViewportState() {
  return useEditorStore((state) => ({
    scale: state.scale,
    setScale: state.setScale,

    panOffset: state.panOffset,
    setPanOffset: state.setPanOffset,

    scaleOffset: state.scaleOffset,
    setScaleOffset: state.setScaleOffset,
  }));
}

/* =========================
   History
========================= */
export function useHistoryState() {
  return useEditorStore((state) => ({
    history: state.history,
    setHistory: state.setHistory,

    redoStack: state.redoStack,
    setRedoStack: state.setRedoStack,
  }));
}

/* =========================
   Text Style
========================= */
export function useTextStyleState() {
  return useEditorStore((state) => ({
    fontSize: state.fontSize,
    setFontSize: state.setFontSize,

    fontFamily: state.fontFamily,
    setFontFamily: state.setFontFamily,

    lineHeightMultiplier: state.lineHeightMultiplier,
    setLineHeightMultiplier: state.setLineHeightMultiplier,
  }));
}
