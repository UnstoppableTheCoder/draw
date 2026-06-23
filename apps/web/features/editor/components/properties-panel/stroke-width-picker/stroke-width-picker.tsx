"use client";

import { Minus } from "lucide-react";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { PropertyItem } from "../property-item";
import { useAppSelector } from "@/hooks/hooks";
import { selectTool } from "@/features/toolbar/toolbar-slice";

export const StrokeWidthPicker = () => {
  const selectedTool = useAppSelector(selectTool);

  // Rendering Stroke Width Picker Conditionally
  if (selectedTool === "text") {
    return;
  }

  const strokeWidth: any = "thin";

  const strokeWidths = [
    {
      value: "thin",
      icon: <Minus strokeWidth={1} className="w-4 h-4" />,
      active: strokeWidth === "thin",
    },
    {
      value: "bold",
      icon: <Minus strokeWidth={3} className="w-4 h-4" />,
      active: strokeWidth === "bold",
    },
    {
      value: "extrabold",
      icon: <Minus strokeWidth={5} className="w-4 h-4" />,
      active: strokeWidth === "extrabold",
    },
  ];

  return (
    <PropertiesPanelItemWrapper title="Stroke Width">
      <div className="flex items-center gap-2 py-1">
        {strokeWidths.map((width) => (
          <PropertyItem key={width.value} data={width} onClick={() => {}} />
        ))}
      </div>
    </PropertiesPanelItemWrapper>
  );
};
