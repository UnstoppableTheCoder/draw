"use client";

import { Minus } from "lucide-react";
import { PropertyItem } from "../property-item";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { useAppSelector } from "@/hooks/hooks";
import { selectTool } from "@/features/toolbar/toolbar-slice";

export const StrokeStylePicker = () => {
  const selectedTool = useAppSelector(selectTool);

  // Rendering Stroke Style Picker Conditionally
  if (selectedTool === "draw" || selectedTool === "text") {
    return;
  }

  const strokeStyle: any = "solid";

  const styles = [
    {
      value: "solid",
      icon: <Minus strokeWidth={1} className="w-4 h-4" />,
      active: strokeStyle === "solid",
    },
    {
      value: "dashed",
      icon: (
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g strokeWidth="2">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M5 12h2"></path>
            <path d="M17 12h2"></path>
            <path d="M11 12h2"></path>
          </g>
        </svg>
      ),
      active: strokeStyle === "dashed",
    },
    {
      value: "dotted",
      icon: (
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g strokeWidth="2">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 12v.01"></path>
            <path d="M8 12v.01"></path>
            <path d="M12 12v.01"></path>
            <path d="M16 12v.01"></path>
            <path d="M20 12v.01"></path>
          </g>
        </svg>
      ),
      active: strokeStyle === "dotted",
    },
  ];

  return (
    <PropertiesPanelItemWrapper title="Stroke Style">
      <div className="flex items-center gap-2 py-1">
        {styles.map((style) => (
          <PropertyItem key={style.value} data={style} onClick={() => {}} />
        ))}
      </div>
    </PropertiesPanelItemWrapper>
  );
};
