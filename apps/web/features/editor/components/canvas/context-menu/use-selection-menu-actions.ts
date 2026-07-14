import { TOLERANCE } from "@/features/editor/constants/canvas";
import { useCanvasRenderer } from "@/features/editor/context/use-renderer";
import { getGroupBounds } from "@/features/editor/geometry/bounding-box/get-group-bounds";
import { normalizeRect } from "@/features/editor/geometry/normalize-rect";
import getTextDimensions from "@/features/editor/geometry/text/get-text-dimensions";
import { createFrameShape } from "@/features/editor/interactions/draw/create-shape";
import {
  useSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "@/features/editor/store/editor/selectors";
import { v4 as uuidv4 } from "uuid";

export default function useSelectionMenuActions({
  overlayCanvasRef,
  pointerRefs,
}: any) {
  const setShapes = useSetShapes();
  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();
  const { invalidate } = useCanvasRenderer();

  const group = () => {
    const selected = new Set(selectedShapesIds);
    const groupId = uuidv4();

    setShapes((prevShapes) =>
      prevShapes.map((prevShape) =>
        selected.has(prevShape.id) ? { ...prevShape, groupId } : prevShape,
      ),
    );

    invalidate();
  };

  const wrapInFrame = () => {
    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) return;
    const scaledTolerance = 5 * TOLERANCE;

    const selected = new Set(selectedShapesIds);

    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
    const bounds = getGroupBounds(selectedShapes);

    if (!bounds) return;

    const frameId = uuidv4();

    const rect = normalizeRect(
      { x: bounds.minX - scaledTolerance, y: bounds.minY - scaledTolerance },
      { x: bounds.maxX + scaledTolerance, y: bounds.maxY + scaledTolerance },
    );

    const data = {
      name: "Frame Name",
      fontSize: 14,
      fontFamily: "Virgil",
    };

    const zIndex = "ad";

    const frame = createFrameShape({
      rect,
      text: {
        ...data,
        ...getTextDimensions({
          ctx,
          text: data.name,
          fontSize: data.fontSize,
          fontFamily: data.fontFamily,
        }),
      },
      zIndex,
    });

    setShapes((prevShapes) => {
      const selectedShapes = prevShapes
        .filter((shape) => selected.has(shape.id))
        .map((shape) => (shape.frameId ? shape : { ...shape, frameId }));

      const otherShapes = prevShapes.filter((shape) => !selected.has(shape.id));

      return [...otherShapes, frame, ...selectedShapes];
    });

    invalidate();
  };

  return { group, wrapInFrame };
}
