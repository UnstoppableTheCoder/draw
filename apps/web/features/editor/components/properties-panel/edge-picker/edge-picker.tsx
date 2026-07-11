import { RefObject } from "react";
import { PropertiesPanelItemWrapper } from "../properties-panel-item-wrapper";
import PropertyRangeSlider from "../property-range-slider";
import {
  useSelectedShapesIds,
  useSelectedTool,
  useShapes,
  useTextEditingState,
} from "@/features/editor/store/editor/selectors";
import { useRoundness } from "@/features/editor/store/properties/selectors";
import useShapeAppearance from "@/features/editor/components/properties-panel/use-shape-appearance";

export default function EdgePicker({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const selectedTool = useSelectedTool();
  const textEditingState = useTextEditingState();

  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();

  const globalRoundness = useRoundness();
  const appearance = useShapeAppearance(sceneCanvasRef);

  if (
    (textEditingState && selectedTool === "select") ||
    (selectedTool !== "rectangle" && selectedTool !== "select")
  ) {
    return;
  }

  let roundness = globalRoundness;

  if (selectedShapesIds.length === 1) {
    const selectedShape = shapes.find(
      (shape) => shape.id === selectedShapesIds[0],
    );

    if (selectedShape?.roundness != null) {
      roundness = selectedShape.roundness;
    }

    if (selectedShape?.type === "text") return;
  }

  const handleRoundnessChange = (roundness: number) => {
    appearance.setRoundness(roundness);
  };

  return (
    <PropertiesPanelItemWrapper title="Edges">
      <PropertyRangeSlider
        value={roundness!}
        maxRange={200}
        onChange={handleRoundnessChange}
      />
    </PropertiesPanelItemWrapper>
  );
}
