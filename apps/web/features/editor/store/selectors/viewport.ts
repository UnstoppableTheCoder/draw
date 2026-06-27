import { useEditorStore } from "../editor-store";

export const useScale = () => useEditorStore((state) => state.scale);

export const useSetScale = () => useEditorStore((state) => state.setScale);

export const usePanOffset = () => useEditorStore((state) => state.panOffset);

export const useSetPanOffset = () =>
  useEditorStore((state) => state.setPanOffset);

export const useScaleOffset = () =>
  useEditorStore((state) => state.scaleOffset);

export const useSetScaleOffset = () =>
  useEditorStore((state) => state.setScaleOffset);
