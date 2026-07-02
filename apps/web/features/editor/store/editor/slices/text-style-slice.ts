import { StateCreator } from "zustand";
import { EditorStore } from "../editor-types";

export const createTextStyleSlice: StateCreator<
  EditorStore,
  [["zustand/devtools", never]],
  [],
  Pick<
    EditorStore,
    | "fontSize"
    | "setFontSize"
    | "fontFamily"
    | "setFontFamily"
    | "lineHeightMultiplier"
    | "setLineHeightMultiplier"
  >
> = (set) => ({
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
});
