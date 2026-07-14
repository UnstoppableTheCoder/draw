"use client";

import { Minus } from "lucide-react";
import { PropertyItem } from "../property-item";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import {
  useSelectedShapesIds,
  useSelectedTool,
  useShapes,
  useTextEditingState,
} from "@/features/editor/store/editor/selectors";
import { StrokeStyle } from "@/features/editor/types/types";
import {
  useSetStrokeStyle,
  useStrokeStyle,
} from "@/features/editor/store/properties/selectors";
import { PropertiesDataType } from "../../types";
import useShapeAppearance from "@/features/editor/components/properties-panel/use-shape-appearance";
import getSelectedShapesTypes from "@/features/editor/interactions/selection/get-selected-shapes-types";
import { RefObject } from "react";

export const StrokeStylePicker = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const selectedTool = useSelectedTool();
  const selectedShapeIds = useSelectedShapesIds();
  const textEditingState = useTextEditingState();
  const shapes = useShapes();
  const globalStrokeStyle = useStrokeStyle();

  const selectedShapesIds = useSelectedShapesIds();
  const selected = new Set(selectedShapesIds);
  const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
  const selectedShapesTypes = getSelectedShapesTypes(selectedShapes);

  const appearance = useShapeAppearance(sceneCanvasRef);

  let strokeStyle = globalStrokeStyle;
  if (selectedShapeIds.length === 1) {
    const selectedShape = shapes.find(
      (shape) => shape.id === selectedShapeIds[0],
    );

    if (selectedShape?.appearance.strokeStyle != null) {
      strokeStyle = selectedShape.appearance.strokeStyle;
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

  const strokeStyles = [
    {
      label: "solid",
      icon: <Minus strokeWidth={1} className="w-4 h-4" />,
    },
    {
      label: "dashed",
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
    },
    {
      label: "dotted",
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
    },
  ];

  const handleStrokeStyleChangeClick = (data: PropertiesDataType) => {
    appearance.setStrokeStyle(data.label as StrokeStyle);
  };

  return (
    <PropertiesPanelItemWrapper title="Stroke Style">
      <div className="flex items-center gap-2 py-1">
        {strokeStyles.map((style, index) => (
          <PropertyItem
            key={index}
            data={{ ...style, active: strokeStyle === style.label }}
            onClick={handleStrokeStyleChangeClick}
          />
        ))}
      </div>
    </PropertiesPanelItemWrapper>
  );
};
