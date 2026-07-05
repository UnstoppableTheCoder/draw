"use client";

import { RefObject } from "react";
import getSelectedShapesTypes from "../../shapes/get-selected-shapes-types";
import {
  useSelectedShapesIds,
  useSelectedTool,
  useShapes,
  useTextEditingState,
} from "../../store/editor/selectors";
import Actions from "./actions/actions";
import BackgroundColorPicker from "./color-picker/background-color-picker";
import StrokeColorPicker from "./color-picker/stroke-color-picker";
import EdgePicker from "./edge-picker/edge-picker";
import { FontTools } from "./font-tools/font-tools";
import LayerPicker from "./layer-picker/layer-picker";
import OpacityPicker from "./opacity-picker/opacity-picker";
import { StrokeStylePicker } from "./stroke-style-picker/stroke-style-picker";
import { StrokeWidthPicker } from "./stroke-width-picker/stroke-width-picker";

export const PropertiesPanel = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const selectedTool = useSelectedTool();
  const selectedShapesIds = useSelectedShapesIds();
  const textEditingState = useTextEditingState();

  const shapes = useShapes();
  const selected = new Set(selectedShapesIds);
  const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
  const selectedShapesTypes = getSelectedShapesTypes(selectedShapes);

  // Render Properties Panel Conditionally
  if (
    !textEditingState &&
    (selectedTool === "select" ||
      selectedTool === "pan" ||
      selectedTool === "eraser") &&
    selectedShapesIds.length === 0
  ) {
    return;
  }

  return (
    <div className="w-[202px] select-none h-fit z-50 bg-white cursor-default rounded-md shadow-spread p-3 space-y-4 absolute top-28 left-5">
      {/* Rendering Style Pickers Conditionally */}
      {selectedTool !== "image" &&
        (selectedShapes.length !== 1 || !selectedShapesTypes.has("image")) && (
          <>
            <StrokeColorPicker sceneCanvasRef={sceneCanvasRef} />
            <BackgroundColorPicker sceneCanvasRef={sceneCanvasRef} />
            <StrokeWidthPicker sceneCanvasRef={sceneCanvasRef} />
            <StrokeStylePicker sceneCanvasRef={sceneCanvasRef} />
            <EdgePicker sceneCanvasRef={sceneCanvasRef} />
            <FontTools sceneCanvasRef={sceneCanvasRef} />
          </>
        )}

      <OpacityPicker sceneCanvasRef={sceneCanvasRef} />
      <LayerPicker />
      <Actions />
    </div>
  );
};
