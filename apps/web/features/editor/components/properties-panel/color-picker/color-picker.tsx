import { Separator } from "@/components/ui/separator";
import React from "react";
import { ColorItem } from "./color-item";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";

const ColorPicker = ({ label, value, onChange }: any) => {
  const colors = {
    stroke: ["#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00"],
    background: ["#ebebeb", "#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99"],
  };

  return (
    <PropertiesPanelItemWrapper title={label}>
      <div className="flex items-center justify-evenly py-1">
        {/* Color selection */}

        {/* @ts-ignore */}
        {colors[label.toLowerCase()].map((color, index) => (
          <ColorItem
            key={index}
            color={color}
            onClick={onChange}
            size="sm"
            active={false}
          />
        ))}

        <Separator orientation="vertical" />

        {/* Selected color */}
        <ColorItem color={value} size="lg" />
      </div>
    </PropertiesPanelItemWrapper>
  );
};

export default ColorPicker;
