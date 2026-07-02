import { useShapePropertiesStore } from "./properties-store";

// Shape Properties
export const useStrokeColor = () =>
  useShapePropertiesStore((state) => state.strokeColor);

export const useBackgroundColor = () =>
  useShapePropertiesStore((state) => state.backgroundColor);

export const useFillStyle = () =>
  useShapePropertiesStore((state) => state.fillStyle);

export const useStrokeWidth = () =>
  useShapePropertiesStore((state) => state.strokeWidth);

export const useStrokeStyle = () =>
  useShapePropertiesStore((state) => state.strokeStyle);

export const useRoughness = () =>
  useShapePropertiesStore((state) => state.roughness);

export const useOpacity = () =>
  useShapePropertiesStore((state) => state.opacity);

export const useRoundness = () =>
  useShapePropertiesStore((state) => state.roundness);

// Text Properties
export const useFontFamily = () =>
  useShapePropertiesStore((state) => state.fontFamily);

export const useFontSize = () =>
  useShapePropertiesStore((state) => state.fontSize);

export const useTextAlign = () =>
  useShapePropertiesStore((state) => state.textAlign);

export const useVerticalAlign = () =>
  useShapePropertiesStore((state) => state.verticalAlign);

// Arrow Properties
export const useStartArrowhead = () =>
  useShapePropertiesStore((state) => state.startArrowhead);

export const useEndArrowhead = () =>
  useShapePropertiesStore((state) => state.endArrowhead);

// Shape Property Actions
export const useSetStrokeColor = () =>
  useShapePropertiesStore((state) => state.setStrokeColor);

export const useSetBackgroundColor = () =>
  useShapePropertiesStore((state) => state.setBackgroundColor);

export const useSetFillStyle = () =>
  useShapePropertiesStore((state) => state.setFillStyle);

export const useSetStrokeWidth = () =>
  useShapePropertiesStore((state) => state.setStrokeWidth);

export const useSetStrokeStyle = () =>
  useShapePropertiesStore((state) => state.setStrokeStyle);

export const useSetRoughness = () =>
  useShapePropertiesStore((state) => state.setRoughness);

export const useSetOpacity = () =>
  useShapePropertiesStore((state) => state.setOpacity);

export const useSetRoundness = () =>
  useShapePropertiesStore((state) => state.setRoundness);

// Text Property Actions
export const useSetFontFamily = () =>
  useShapePropertiesStore((state) => state.setFontFamily);

export const useSetFontSize = () =>
  useShapePropertiesStore((state) => state.setFontSize);

export const useSetTextAlign = () =>
  useShapePropertiesStore((state) => state.setTextAlign);

export const useSetVerticalAlign = () =>
  useShapePropertiesStore((state) => state.setVerticalAlign);

// Arrow Property Actions
export const useSetStartArrowhead = () =>
  useShapePropertiesStore((state) => state.setStartArrowhead);

export const useSetEndArrowhead = () =>
  useShapePropertiesStore((state) => state.setEndArrowhead);
