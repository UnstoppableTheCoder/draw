import { useUser } from "@/features/auth/store/selectors";
import { TOLERANCE } from "@/features/editor/constants/canvas";
import { useCanvasRenderer } from "@/features/editor/context/use-renderer";
import { getGroupBounds } from "@/features/editor/geometry/bounding-box/get-group-bounds";
import { normalizeRect } from "@/features/editor/geometry/normalize-rect";
import getTextDimensions from "@/features/editor/geometry/text/get-text-dimensions";
import { compareByZIndex } from "@/features/editor/interactions/move/use-shape-move";
import { updateShapes } from "@/features/editor/networking/api/shape-api";
import {
  usePushHistory,
  useSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "@/features/editor/store/editor/selectors";
import { Shape } from "@/features/editor/types";
import {
  getNextZIndex,
  getPreviousZIndex,
} from "@/features/editor/utils/shape-z-index";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  createShapes as createShapesApi,
  updateShapes as updateShapesApi,
} from "../../../networking/api/shape-api";
import { createFrameShape } from "@/features/editor/interactions/draw/create-shape";

export default function useSelectionMenuActions({
  overlayCanvasRef,
  pointerRefs,
}: any) {
  const { pageId } = useParams<{ pageId: string }>();

  const setShapes = useSetShapes();
  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();
  const { invalidate } = useCanvasRenderer();
  const user = useUser();
  const pushHistory = usePushHistory();

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

  const wrapInFrame = async () => {
    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) return;

    const scaledTolerance = 5 * TOLERANCE;

    const selected = new Set(selectedShapesIds);

    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));

    const bounds = getGroupBounds(selectedShapes);

    if (!bounds) return;

    const frameId = uuidv4();

    const rect = normalizeRect(
      {
        x: bounds.minX - scaledTolerance,
        y: bounds.minY - scaledTolerance,
      },
      {
        x: bounds.maxX + scaledTolerance,
        y: bounds.maxY + scaledTolerance,
      },
    );

    const data = {
      name: "Frame Name",
      fontSize: 14,
      fontFamily: "Virgil",
    };

    const orderedSelectedShapes = [...selectedShapes].sort(compareByZIndex);

    const firstShapeZIndex = orderedSelectedShapes[0]?.zIndex ?? null;

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
      zIndex: getPreviousZIndex(firstShapeZIndex),
      pageId,
      createdById: user!.id,
    });

    const previousShapes = shapes;

    const changedShapes: Shape[] = [];

    const nextShapes = previousShapes.map((shape) => {
      if (!selected.has(shape.id)) {
        return shape;
      }

      if (shape.frameId === frameId) {
        return shape;
      }

      const updatedShape = {
        ...shape,
        frameId,
      };

      changedShapes.push(updatedShape);

      return updatedShape;
    });

    setShapes([...nextShapes, frame]);

    pushHistory();
    invalidate();

    try {
      await Promise.all([
        createShapesApi(pageId, [frame]),
        updateShapesApi
        (pageId, changedShapes),
      ]);
    } catch (error) {
      console.error("Failed to wrap shapes in frame", error);

      setShapes(previousShapes);
      invalidate();
    }
  };

  return { group, wrapInFrame };
}
