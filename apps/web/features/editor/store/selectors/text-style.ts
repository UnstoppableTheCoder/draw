import { useEditorStore } from "../editor-store";

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
