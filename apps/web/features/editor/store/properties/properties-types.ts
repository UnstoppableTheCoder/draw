import { Arrowhead, FillStyle, StrokeStyle } from "../../types/types";

export interface ShapePropertiesStore {
  strokeColor: string;
  backgroundColor: string;

  fillStyle: FillStyle;

  strokeWidth: number;
  strokeStyle: StrokeStyle;

  roughness: number;
  opacity: number;

  roundness: number | null;

  fontFamily: string;
  fontSize: number;

  textAlign: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";

  startArrowhead: Arrowhead;
  endArrowhead: Arrowhead;

  setStrokeColor: (strokeColor: string) => void;
  setBackgroundColor: (backgroundColor: string) => void;

  setFillStyle: (fillStyle: FillStyle) => void;

  setStrokeWidth: (strokeWidth: number) => void;
  setStrokeStyle: (strokeStyle: StrokeStyle) => void;

  setRoughness: (roughness: number) => void;
  setOpacity: (opacity: number) => void;

  setRoundness: (roundness: number | null) => void;

  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: number) => void;

  setTextAlign: (textAlign: "left" | "center" | "right") => void;

  setVerticalAlign: (verticalAlign: "top" | "middle" | "bottom") => void;

  setStartArrowhead: (startArrowhead: Arrowhead) => void;
  setEndArrowhead: (endArrowhead: Arrowhead) => void;
}
