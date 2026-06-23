import React from "react";
import ColorPicker from "./color-picker";
import { useAppSelector } from "@/hooks/hooks";
import { selectTool } from "@/features/toolbar/toolbar-slice";

const BackgroundColorPicker = () => {
  const selectedTool = useAppSelector(selectTool);

  // Render Background Color Picker Conditionally
  if (selectedTool === "arrow" || selectedTool === "text") {
    return;
  }

  return <ColorPicker label="Background" value="#ebebeb" onChange={() => {}} />;
};

export default BackgroundColorPicker;
