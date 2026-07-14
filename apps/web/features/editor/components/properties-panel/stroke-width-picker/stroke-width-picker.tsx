"use client";

import { Minus } from "lucide-react";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { PropertyItem } from "../property-item";
import {
  useSelectedShapesIds,
  useSelectedTool,
  useShapes,
  useTextEditingState,
} from "@/features/editor/store/editor/selectors";
import { useStrokeWidth } from "@/features/editor/store/properties/selectors";
import { PropertiesDataType } from "../../types";
import useShapeAppearance from "@/features/editor/components/properties-panel/use-shape-appearance";
import getSelectedShapesTypes from "@/features/editor/interactions/selection/get-selected-shapes-types";
import { RefObject } from "react";

export const StrokeWidthPicker = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const selectedTool = useSelectedTool();
  const textEditingState = useTextEditingState();
  const globalStrokeWidth = useStrokeWidth();
  const appearance = useShapeAppearance(sceneCanvasRef);

  const selectedShapeIds = useSelectedShapesIds();
  const shapes = useShapes();

  const selectedShapesIds = useSelectedShapesIds();
  const selected = new Set(selectedShapesIds);
  const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
  const selectedShapesTypes = getSelectedShapesTypes(selectedShapes);

  // derive strokeWidth (single source of truth)
  let strokeWidth = globalStrokeWidth;

  if (selectedShapeIds.length === 1) {
    const selectedShape = shapes.find(
      (shape) => shape.id === selectedShapeIds[0],
    );

    if (selectedShape?.appearance.strokeWidth != null) {
      strokeWidth = selectedShape.appearance.strokeWidth;
    }
  }
  // Rendering Stroke Style Picker Conditionally
  if (
    (textEditingState && selectedTool === "select") ||
    selectedTool === "text"
  ) {
    return;
  }

  // Applies when shapes are selected
  if (selectedShapesIds.length === 1 && selectedShapesTypes.has("text")) return;

  const strokeWidths: PropertiesDataType[] = [
    {
      label: "thin",
      value: "1",
      icon: <Minus strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "bold",
      value: "2",
      icon: <Minus strokeWidth={2} className="w-4 h-4" />,
    },
    {
      label: "extrabold",
      value: "4",
      icon: <Minus strokeWidth={4} className="w-4 h-4" />,
    },
  ];

  const handleStrokeWidthChange = (data: PropertiesDataType) => {
    if (data.value != null) {
      appearance.setStrokeWidth(Number(data.value));
    }
  };

  return (
    <PropertiesPanelItemWrapper title="Stroke Width">
      <div className="flex items-center gap-2 py-1">
        {strokeWidths.map((width) => (
          <PropertyItem
            key={width.value}
            data={{
              ...width,
              active: strokeWidth === Number(width.value),
            }}
            onClick={handleStrokeWidthChange}
          />
        ))}
      </div>
    </PropertiesPanelItemWrapper>
  );
};
