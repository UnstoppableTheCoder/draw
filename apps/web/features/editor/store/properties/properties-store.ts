import { create } from "zustand";
import { Arrowhead, FillStyle, StrokeStyle } from "../../types/types";
import { ShapePropertiesStore } from "./properties-types";
import { devtools } from "zustand/middleware";

export const useShapePropertiesStore = create<ShapePropertiesStore>()(
  devtools(
    (set) => ({
      strokeColor: "#ffffff",
      backgroundColor: "transparent",

      fillStyle: "solid",

      strokeWidth: 2,
      strokeStyle: "solid",

      roughness: 1,
      opacity: 100,

      roundness: null,

      fontFamily: "Virgil",
      fontSize: 20,

      textAlign: "left",
      verticalAlign: "top",

      startArrowhead: null,
      endArrowhead: "arrow",

      setStrokeColor: (strokeColor: string) => set({ strokeColor }),

      setBackgroundColor: (backgroundColor: string) => set({ backgroundColor }),

      setFillStyle: (fillStyle: FillStyle) => set({ fillStyle }),

      setStrokeWidth: (strokeWidth: number) => set({ strokeWidth }),

      setStrokeStyle: (strokeStyle: StrokeStyle) => set({ strokeStyle }),

      setRoughness: (roughness: number) => set({ roughness }),

      setOpacity: (opacity: number) => set({ opacity }),

      setRoundness: (roundness: number | null) => set({ roundness }),

      setFontFamily: (fontFamily: string) => set({ fontFamily }),

      setFontSize: (fontSize: number) => set({ fontSize }),

      setTextAlign: (textAlign: "left" | "center" | "right") =>
        set({ textAlign }),

      setVerticalAlign: (verticalAlign: "top" | "middle" | "bottom") =>
        set({ verticalAlign }),

      setStartArrowhead: (startArrowhead: Arrowhead) => set({ startArrowhead }),

      setEndArrowhead: (endArrowhead: Arrowhead) => set({ endArrowhead }),
    }),
    {
      name: "properties-store",
    },
  ),
);
