import React, { RefObject } from "react";
import ColorPicker from "./color-picker";
import {
  useSetStrokeColor,
  useStrokeColor,
} from "@/features/editor/store/properties/selectors";
import {
  useSelectedShapesIds,
  useShapes,
} from "@/features/editor/store/editor/selectors";
import useShapeAppearance from "@/features/editor/components/properties-panel/use-shape-appearance";

const StrokeColorPicker = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const selectedShapeIds = useSelectedShapesIds();
  const shapes = useShapes();
  const appearance = useShapeAppearance(sceneCanvasRef);

  let strokeColor = useStrokeColor();

  if (selectedShapeIds.length === 1) {
    const selectedShape = shapes.find(
      (shape) => shape.id === selectedShapeIds[0],
    );

    if (!selectedShape) return;

    strokeColor = selectedShape.strokeColor!;
  }

  const handleStrokeColorChangeClick = (color: string) => {
    appearance.setStrokeColor(color);
  };

  return (
    <ColorPicker
      title="Stroke"
      type="stroke"
      value={strokeColor}
      onClick={handleStrokeColorChangeClick}
    />
  );
};

export default StrokeColorPicker;
