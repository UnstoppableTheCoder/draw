import {
  useSelectedShapesIds,
  useSelectedTool,
  useShapes,
} from "@/features/editor/store/editor/selectors";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import { FontFamilyPicker } from "./font-family-picker/font-family-picker";
import { FontSizePicker } from "./font-size-picker/font-size-picker";
import { TextAlignPicker } from "./text-align-picker/text-align-picker";
import getSelectedShapesTypes from "@/features/editor/shapes/get-selected-shapes-types";
import { RefObject } from "react";

export const FontTools = ({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
  const selectedTool = useSelectedTool();

  const selectedShapesIds = useSelectedShapesIds();
  const shapes = useShapes();
  const selected = new Set(selectedShapesIds);
  const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
  const selectedShapesTypes = getSelectedShapesTypes(selectedShapes);

  // Rendering Font Tools Conditionally
  if (selectedTool !== "text" && selectedTool !== "select") {
    return;
  }

  // Applies when shapes are selected
  if (selectedShapesIds.length !== 0 && !selectedShapesTypes.has("text"))
    return;

  const items = [
    {
      element: <FontSizePicker sceneCanvasRef={sceneCanvasRef} />,
      title: "Font size",
    },
    {
      element: <FontFamilyPicker sceneCanvasRef={sceneCanvasRef} />,
      title: "Font family",
    },
    {
      element: <TextAlignPicker sceneCanvasRef={sceneCanvasRef} />,
      title: "Text align",
    },
  ];

  return (
    <>
      {items.map((item, index) => (
        <PropertiesPanelItemWrapper key={index} title={item.title}>
          {item.element}
        </PropertiesPanelItemWrapper>
      ))}
    </>
  );
};
