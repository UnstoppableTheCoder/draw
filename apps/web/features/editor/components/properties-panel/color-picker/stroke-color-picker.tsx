import React from "react";
import ColorPicker from "./color-picker";
import {
  useSetStrokeColor,
  useStrokeColor,
} from "@/features/editor/store/properties/selectors";

const StrokeColorPicker = () => {
  const setStrokeColor = useSetStrokeColor();
  const strokeColor = useStrokeColor();

  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
  };

  return (
    <ColorPicker
      title="Stroke"
      type="stroke"
      value={strokeColor}
      onChange={handleStrokeColorChange}
    />
  );
};

export default StrokeColorPicker;
