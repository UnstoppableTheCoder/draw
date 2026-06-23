// store/selectors.ts

import { useEditorStore } from "./editor-store";

/* =========================
   Tools
========================= */

export const useSelectedTool = () =>
  useEditorStore((state) => state.selectedTool);

export const useSetSelectedTool = () =>
  useEditorStore((state) => state.setSelectedTool);

export const useLockTool = () => useEditorStore((state) => state.lockTool);

export const useSetLockTool = () =>
  useEditorStore((state) => state.setLockTool);

/* =========================
   Interaction
========================= */

export const useInteractionMode = () =>
  useEditorStore((state) => state.interactionMode);

export const useSetInteractionMode = () =>
  useEditorStore((state) => state.setInteractionMode);

/* =========================
   Shapes
========================= */

export const useShapes = () => useEditorStore((state) => state.shapes);

export const useSetShapes = () => useEditorStore((state) => state.setShapes);

/* =========================
   Selection
========================= */

export const useSelectedShape = () =>
  useEditorStore((state) => state.selectedShape);

export const useSetSelectedShape = () =>
  useEditorStore((state) => state.setSelectedShape);

export const useSelectedShapeBounds = () =>
  useEditorStore((state) => state.selectedShapeBounds);

export const useSetSelectedShapeBounds = () =>
  useEditorStore((state) => state.setSelectedShapeBounds);

/* =========================
   Text Editing
========================= */

export const useTextEditingState = () =>
  useEditorStore((state) => state.textEditingState);

export const useSetTextEditingState = () =>
  useEditorStore((state) => state.setTextEditingState);

/* =========================
   Viewport
========================= */

export const useScale = () => useEditorStore((state) => state.scale);

export const useSetScale = () => useEditorStore((state) => state.setScale);

export const usePanOffset = () => useEditorStore((state) => state.panOffset);

export const useSetPanOffset = () =>
  useEditorStore((state) => state.setPanOffset);

export const useScaleOffset = () =>
  useEditorStore((state) => state.scaleOffset);

export const useSetScaleOffset = () =>
  useEditorStore((state) => state.setScaleOffset);

/* =========================
   History
========================= */

export const useHistory = () => useEditorStore((state) => state.history);

export const useSetHistory = () => useEditorStore((state) => state.setHistory);

export const useRedoStack = () => useEditorStore((state) => state.redoStack);

export const useSetRedoStack = () =>
  useEditorStore((state) => state.setRedoStack);

/* =========================
   Text Style
========================= */

export const useFontSize = () => useEditorStore((state) => state.fontSize);

export const useSetFontSize = () =>
  useEditorStore((state) => state.setFontSize);

export const useFontFamily = () => useEditorStore((state) => state.fontFamily);

export const useSetFontFamily = () =>
  useEditorStore((state) => state.setFontFamily);

export const useLineHeightMultiplier = () =>
  useEditorStore((state) => state.lineHeightMultiplier);

export const useSetLineHeightMultiplier = () =>
  useEditorStore((state) => state.setLineHeightMultiplier);
