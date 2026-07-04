import { RefObject } from "react";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import PropertyRangeSlider from "../property-range-slider";
import {
  useSelectedShapesIds,
  useShapes,
} from "@/features/editor/store/editor/selectors";
import useShapeAppearance from "@/features/editor/hooks/appearance/use-shape-appearance";
import { useOpacity } from "@/features/editor/store/properties/selectors";

export default function OpacityPicker({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();

  const globalOpacity = useOpacity();
  const appearance = useShapeAppearance(sceneCanvasRef);

  let opacity = globalOpacity;

  if (selectedShapesIds.length === 1) {
    const selectedShape = shapes.find(
      (shape) => shape.id === selectedShapesIds[0],
    );

    if (selectedShape?.opacity != null) {
      opacity = selectedShape.opacity;
    }
  }

  const handleOpacityChange = (opacity: number) => {
    appearance.setOpacity(opacity);
  };

  return (
    <PropertiesPanelItemWrapper title="Opacity">
      <PropertyRangeSlider
        value={opacity}
        maxRange={100}
        onChange={handleOpacityChange}
      />
    </PropertiesPanelItemWrapper>
  );
}
