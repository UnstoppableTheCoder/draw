"use client";

import { useSelectedTool } from "../../store/selectors";
import BackgroundColorPicker from "./color-picker/background-color-picker";
import StrokeColorPicker from "./color-picker/stroke-color-picker";
import { FontTools } from "./font-tools/font-tools";
import { StrokeStylePicker } from "./stroke-style-picker/stroke-style-picker";
import { StrokeWidthPicker } from "./stroke-width-picker/stroke-width-picker";

export const PropertiesPanel = () => {
  const selectedTool = useSelectedTool();

  // Render Properties Panel Conditionally
  if (
    selectedTool === "select" ||
    selectedTool === "pan" ||
    selectedTool === "eraser"
  ) {
    return;
  }

  return (
    <div className="w-[202px] select-none h-fit z-50 bg-white cursor-default rounded-md shadow-spread p-3 space-y-4 absolute top-28 left-5">
      {/* Rendering Style Pickers Conditionally */}
      {selectedTool !== "image" && (
        <>
          <StrokeColorPicker />
          <BackgroundColorPicker />
          <StrokeWidthPicker />
          <StrokeStylePicker />
          <FontTools />
        </>
      )}
    </div>
  );
};
