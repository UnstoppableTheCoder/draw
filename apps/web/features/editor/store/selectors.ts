// store/selectors.ts

import { useEditorStore } from "./editor-store";

/* =========================
   Tools
========================= */

export const useSelectedTool = () =>
  useEditorStore((state) => state.selectedTool);

export const useSetSelectedTool = () =>
  useEditorStore.getState().setSelectedTool;

export const useIsLocked = () => useEditorStore((state) => state.isLocked);

export const useSetIsLocked = () => useEditorStore.getState().setIsLocked;

/* =========================
   Interaction
========================= */

export const useInteractionMode = () =>
  useEditorStore((state) => state.interactionMode);

export const useSetInteractionMode = () =>
  useEditorStore.getState().setInteractionMode;

/* =========================
   Shapes
========================= */

export const useShapes = () => useEditorStore((state) => state.shapes);

export const useSetShapes = () => useEditorStore.getState().setShapes;

/* =========================
   Selection
========================= */

export const useSelectedShape = () =>
  useEditorStore((state) => state.selectedShape);

export const useSetSelectedShape = () =>
  useEditorStore.getState().setSelectedShape;

export const useSelectedShapeBounds = () =>
  useEditorStore((state) => state.selectedShapeBounds);

export const useSetSelectedShapeBounds = () =>
  useEditorStore.getState().setSelectedShapeBounds;

/* =========================
   Text Editing
========================= */

export const useTextEditingState = () =>
  useEditorStore((state) => state.textEditingState);

export const useSetTextEditingState = () =>
  useEditorStore.getState().setTextEditingState;

/* =========================
   Viewport
========================= */

export const useScale = () => useEditorStore((state) => state.scale);

export const useSetScale = () => useEditorStore.getState().setScale;

export const usePanOffset = () => useEditorStore((state) => state.panOffset);

export const useSetPanOffset = () => useEditorStore.getState().setPanOffset;

export const useScaleOffset = () =>
  useEditorStore((state) => state.scaleOffset);

export const useSetScaleOffset = () => useEditorStore.getState().setScaleOffset;

/* =========================
   History
========================= */

export const useHistory = () => useEditorStore((state) => state.history);

export const useSetHistory = () => useEditorStore.getState().setHistory;

export const useRedoStack = () => useEditorStore((state) => state.redoStack);

export const useSetRedoStack = () => useEditorStore.getState().setRedoStack;

/* =========================
   Text Style
========================= */

export const useFontSize = () => useEditorStore((state) => state.fontSize);

export const useSetFontSize = () => useEditorStore.getState().setFontSize;

export const useFontFamily = () => useEditorStore((state) => state.fontFamily);

export const useSetFontFamily = () => useEditorStore.getState().setFontFamily;

export const useLineHeightMultiplier = () =>
  useEditorStore((state) => state.lineHeightMultiplier);

export const useSetLineHeightMultiplier = () =>
  useEditorStore.getState().setLineHeightMultiplier;
