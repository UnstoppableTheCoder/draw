import React from "react";
import { ColorItem } from "./color-item";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { COLOR_PALETTE } from "@/features/editor/constants/colors";
import {
  useBackgroundColor,
  useStrokeColor,
} from "@/features/editor/store/properties/selectors";
import { Separator } from "@/components/ui/separator";

type ColorPickerProps = {
  title: "Stroke" | "Background";
  type: "stroke" | "background";
  value: string;
  onClick: (color: string) => void;
};

const ColorPicker = ({ title, type, value, onClick }: ColorPickerProps) => {
  const colors = Object.values(COLOR_PALETTE);
  const backgroundColor = useBackgroundColor();
  const strokeColor = useStrokeColor();

  const selectedColor = type === "background" ? backgroundColor : strokeColor;

  return (
    <PropertiesPanelItemWrapper title={title}>
      <div className="flex items-center justify-evenly py-1">
        {/* Color selection */}

        {colors.map((color, index) => {
          return (
            <ColorItem
              key={index}
              color={color["dark"][type]}
              onClick={onClick}
              size="sm"
              active={selectedColor === color["dark"][type]}
            />
          );
        })}

        <Separator orientation="vertical" />

        {/* Selected color */}
        <ColorItem color={value} size="lg" />
      </div>
    </PropertiesPanelItemWrapper>
  );
};

export default ColorPicker;
