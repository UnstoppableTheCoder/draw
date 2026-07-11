"use client";

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { PropertyItem } from "../../property-item";
import { RefObject } from "react";
import { PropertiesDataType } from "../../../types";
import { useTextAlign } from "@/features/editor/store/properties/selectors";
import useShapeAppearance from "@/features/editor/components/properties-panel/use-shape-appearance";
import {
  useSelectedShapesIds,
  useShapes,
} from "@/features/editor/store/editor/selectors";
import { TextAlign } from "@/features/editor/types/types";

export const TextAlignPicker = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const globalTextAlign = useTextAlign();
  const appearance = useShapeAppearance(sceneCanvasRef);

  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();

  let textAlign = globalTextAlign;

  if (selectedShapesIds.length === 1) {
    const selectedShape = shapes.find(
      (shape) => shape.id === selectedShapesIds[0],
    );

    if (selectedShape && selectedShape.type !== "text") return;

    if (selectedShape?.textAlign != null) {
      textAlign = selectedShape.textAlign;
    }
  }

  const textAlignStyles = [
    {
      label: "Left",
      value: "left",
      icon: <AlignLeft className={"w-4 h-4"} />,
    },
    {
      label: "Center",
      value: "center",
      icon: <AlignCenter className={"w-4 h-4"} />,
    },

    {
      label: "Right",
      value: "right",
      icon: <AlignRight className={"w-4 h-4"} />,
    },
  ];

  const handleTextAlignChangeClick = (data: PropertiesDataType) => {
    if (data.value) {
      appearance.setTextAlign(data.value as TextAlign);
    }
  };

  return (
    <div className="flex items-center gap-2 py-1">
      {textAlignStyles.map((align, index) => (
        <PropertyItem
          key={index}
          data={{ ...align, active: align.value === textAlign }}
          onClick={handleTextAlignChangeClick}
        />
      ))}
    </div>
  );
};
