import React from "react";
import { ColorItem } from "./color-item";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { Separator } from "../../ui/separator";
import { COLOR_PALETTE } from "@/features/editor/constants/colors";

type ColorPickerProps = {
  title: "Stroke" | "Background";
  type: "stroke" | "background";
  value: string;
  onChange: (color: string) => void;
};

const ColorPicker = ({ title, type, value, onChange }: ColorPickerProps) => {
  const theme = "dark";

  const colors = Object.values(COLOR_PALETTE);

  return (
    <PropertiesPanelItemWrapper title={title}>
      <div className="flex items-center justify-evenly py-1">
        {/* Color selection */}

        {colors.map((color, index) => {
          return (
            <ColorItem
              key={index}
              color={color["dark"][type]}
              onClick={() => onChange(color["dark"][type])}
              size="sm"
              active={false}
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
