import React, { RefObject } from "react";
import ColorPicker from "./color-picker";
import {
  useSelectedShapesIds,
  useSelectedTool,
  useShapes,
  useTextEditingState,
} from "@/features/editor/store/editor/selectors";
import { useBackgroundColor } from "@/features/editor/store/properties/selectors";
import useShapeAppearance from "@/features/editor/components/properties-panel/use-shape-appearance";
import getSelectedShapesTypes from "@/features/editor/interactions/selection/get-selected-shapes-types";

const BackgroundColorPicker = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const selectedTool = useSelectedTool();
  const textEditingState = useTextEditingState();

  let backgroundColor = useBackgroundColor();
  const selectedShapesIds = useSelectedShapesIds();
  const shapes = useShapes();
  const selected = new Set(selectedShapesIds);
  const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
  const selectedShapesTypes = getSelectedShapesTypes(selectedShapes);

  const appearance = useShapeAppearance(sceneCanvasRef);

  if (selectedShapesIds.length === 1) {
    const selectedShape = shapes.find(
      (shape) => shape.id === selectedShapesIds[0],
    );

    if (!selectedShape) return;

    backgroundColor = selectedShape.backgroundColor!;
  }

  // Render Background Color Picker Conditionally
  if (
    (textEditingState && selectedTool === "select") ||
    selectedTool === "arrow" ||
    selectedTool === "text" ||
    selectedTool === "line" ||
    selectedTool === "freedraw"
  ) {
    return;
  }

  // Applies when shapes are selected
  if (
    selectedShapesIds.length !== 0 &&
    !selectedShapesTypes.has("rectangle") &&
    !selectedShapesTypes.has("diamond") &&
    !selectedShapesTypes.has("ellipse")
  )
    return;

  const handleBackgroundColorChangeClick = (color: string) => {
    appearance.setBackgroundColor(color);
  };

  return (
    <ColorPicker
      title="Background"
      type="background"
      value={backgroundColor}
      onClick={handleBackgroundColorChangeClick}
    />
  );
};

export default BackgroundColorPicker;
