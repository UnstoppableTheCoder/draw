import React from "react";
import ColorPicker from "./color-picker";
import { useSelectedTool } from "@/features/editor/store/selectors";

const BackgroundColorPicker = () => {
  const selectedTool = useSelectedTool();

  // Render Background Color Picker Conditionally
  if (selectedTool === "arrow" || selectedTool === "text") {
    return;
  }

  return <ColorPicker label="Background" value="#ebebeb" onChange={() => {}} />;
};

export default BackgroundColorPicker;
