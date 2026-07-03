import React from "react";
import ColorPicker from "./color-picker";
import { useSelectedTool } from "@/features/editor/store/editor/selectors";
import {
  useBackgroundColor,
  useSetBackgroundColor,
} from "@/features/editor/store/properties/selectors";

const BackgroundColorPicker = () => {
  const selectedTool = useSelectedTool();

  const backgroundColor = useBackgroundColor();
  const setBackgroundColor = useSetBackgroundColor();

  // Render Background Color Picker Conditionally
  if (
    selectedTool === "arrow" ||
    selectedTool === "text" ||
    selectedTool === "line" ||
    selectedTool === "freedraw"
  ) {
    return;
  }

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  return (
    <ColorPicker
      title="Background"
      type="background"
      value={backgroundColor}
      onChange={handleBackgroundColorChange}
    />
  );
};

export default BackgroundColorPicker;
