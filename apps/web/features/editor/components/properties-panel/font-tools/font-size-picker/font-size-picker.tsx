"use client";

import { useFontSize } from "@/features/editor/store/properties/selectors";
import { PropertyItem } from "../../property-item";
import { PropertiesDataType } from "../../../types";
import useShapeAppearance from "@/features/editor/hooks/appearance/use-shape-appearance";
import {
  useSelectedShapesIds,
  useShapes,
} from "@/features/editor/store/editor/selectors";
import { RefObject } from "react";

export const FontSizePicker = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const globalFontSize = useFontSize();
  const appearance = useShapeAppearance(sceneCanvasRef);

  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();

  let fontSize = globalFontSize;

  if (selectedShapesIds.length === 1) {
    const selectedShape = shapes.find(
      (shape) => shape.id === selectedShapesIds[0],
    );

    if (selectedShape && selectedShape.type !== "text") return;

    if (selectedShape?.fontSize != null) {
      fontSize = selectedShape.fontSize;
    }
  }

  const fontSizes = [
    {
      label: "Small",
      value: "16",
      icon: "S",
    },
    {
      label: "Medium",
      value: "20",
      icon: "M",
    },

    {
      label: "Large",
      value: "28",
      icon: "L",
    },
    {
      label: "Extra large",
      value: "36",
      icon: "XL",
    },
  ];

  const handleFontSizeChangeClick = (data: PropertiesDataType) => {
    if (data.value) {
      appearance.setFontSize(Number(data.value));
    }
  };

  return (
    <div className="flex items-center gap-2 py-1">
      {fontSizes.map((size, index) => (
        <PropertyItem
          key={index}
          data={{ ...size, active: Number(size.value) === fontSize }}
          onClick={handleFontSizeChangeClick}
        />
      ))}
    </div>
  );
};
