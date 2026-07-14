"use client";

import { CaseUpper, Code, Pencil } from "lucide-react";
import { PropertyItem } from "../../property-item";
import { RefObject } from "react";
import { useFontFamily } from "@/features/editor/store/properties/selectors";
import useShapeAppearance from "@/features/editor/components/properties-panel/use-shape-appearance";
import {
  useSelectedShapesIds,
  useShapes,
} from "@/features/editor/store/editor/selectors";
import { PropertiesDataType } from "../../../types";

export const FontFamilyPicker = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const globalFontFamily = useFontFamily();
  const appearance = useShapeAppearance(sceneCanvasRef);

  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();

  let fontFamily = globalFontFamily;

  if (selectedShapesIds.length === 1) {
    const selectedShape = shapes.find(
      (shape) => shape.id === selectedShapesIds[0],
    );

    if (selectedShape && selectedShape.type !== "text") return;

    if (selectedShape?.data.fontFamily != null) {
      fontFamily = selectedShape.data.fontFamily;
    }
  }

  const fontFamilies = [
    {
      label: "Hand Drawn",
      value: "Virgil",
      icon: <Pencil className="w-4 h-4" />,
    },
    {
      label: "Normal",
      value: "Helvetica",
      icon: <CaseUpper className="w-4 h-4" />,
    },
    {
      label: "Code",
      value: "Cascadia Code",
      icon: <Code className="w-4 h-4" />,
    },
  ];

  const handleFontFamilyChangeClick = (data: PropertiesDataType) => {
    if (data.value) {
      appearance.setFontFamily(data.value);
    }
  };

  return (
    <div className="flex items-center gap-2 py-1">
      {fontFamilies.map((family, index) => (
        <PropertyItem
          key={index}
          data={{ ...family, active: family.value === fontFamily }}
          onClick={handleFontFamilyChangeClick}
        />
      ))}
    </div>
  );
};
