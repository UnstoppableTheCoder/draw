import { useEffect } from "react";
import {
  useSelectedShapeIds,
  useSetShapes,
} from "../../store/editor/selectors";
import {
  useBackgroundColor,
  useStrokeColor,
} from "../../store/properties/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";

export default function useShapeAppearance() {
  const strokeColor = useStrokeColor();
  const backgroundColor = useBackgroundColor();

  const selectedShapeIds = useSelectedShapeIds();
  const setShapes = useSetShapes();
  const { invalidate } = useCanvasRenderer();

  useEffect(() => {
    const selected = new Set(selectedShapeIds);

    console.log("Style changed");
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        selected.has(shape.id)
          ? { ...shape, strokeColor, backgroundColor }
          : shape,
      ),
    );

    invalidate();
  }, [strokeColor, backgroundColor]);
}
