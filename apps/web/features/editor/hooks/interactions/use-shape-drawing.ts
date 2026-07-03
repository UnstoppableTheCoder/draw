import { PointerEvent, RefObject } from "react";
import { createShape } from "../../shapes/create-shape";
import { updateDrawingPoints } from "../../shapes/update-shape";
import * as store from "../../store/editor/selectors";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import {
  resetInteraction,
  usePointerState,
} from "../pointer/use-pointer-state";
import { Point, PointTuple } from "../../types/types";
import { useCanvasRenderer } from "../../context/use-renderer";
import {
  useBackgroundColor,
  useStrokeColor,
} from "../../store/properties/selectors";
import useSelectionActions, { getGroupBounds } from "./use-selection-actions";
import useCanvasCursor from "../canvas/use-canvas-cursor";
import { nextDev } from "next/dist/cli/next-dev";

type UseDrawingArgs = {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
};

export default function useShapeDrawing({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
}: UseDrawingArgs) {
  const { drawingStartRef, drawingPointsRef } = pointerRefs;

  const setShapes = store.useSetShapes();
  const selectedTool = store.useSelectedTool();
  const setSelectedShapeIds = store.useSetSelectedShapeIds();
  const pushHistory = store.usePushHistory();
  const isLocked = store.useIsLocked();

  const strokeColor = useStrokeColor();
  const backgroundColor = useBackgroundColor();

  const { clientToCanvas } = useViewportHelpers(overlayCanvasRef);
  const { invalidateOverlay } = useCanvasRenderer();
  const selection = useSelectionActions({
    sceneCanvasRef,
    overlayCanvasRef,
    pointerRefs,
  });
  const cursor = useCanvasCursor({ overlayCanvasRef, pointerRefs });

  // Get Canvas Point
  function getCanvasPoint(e: PointerEvent<HTMLCanvasElement>) {
    return clientToCanvas(e.clientX, e.clientY);
  }

  function createDrawingShape(end: Point) {
    if (!drawingStartRef.current) return null;

    return createShape({
      tool: selectedTool,
      startPoint: drawingStartRef.current,
      endPoint: end,
      points: drawingPointsRef.current,
      strokeColor,
      backgroundColor,
    });
  }

  // Sets Initial Point on Pointer Down - for Shapes With Points
  function onPointerDownDrawing(e: PointerEvent<HTMLCanvasElement>) {
    if (pointerRefs.interactionRef.current.type !== "draw") return;
    const point = getCanvasPoint(e);

    drawingStartRef.current = point;
    drawingPointsRef.current = [[0, 0]];
  }

  // Handles Drawing During Mouse Move
  function onPointerMoveDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    const interaction = pointerRefs.interactionRef.current;
    if (interaction.type !== "draw") return;

    const start = drawingStartRef.current;
    if (!start) return;

    const end = getCanvasPoint(e);
    if (!end) return;

    const relativePoint: PointTuple = [end.x - start.x, end.y - start.y];

    drawingPointsRef.current = updateDrawingPoints({
      tool: selectedTool,
      relativePoint,
      currentPoints: drawingPointsRef.current,
    });

    const shape = createDrawingShape(end);
    if (!shape) return;

    interaction.previewShape = shape;
    invalidateOverlay();
  }

  // Saves the Shapes
  function onPointerUpDrawing(e: PointerEvent<HTMLCanvasElement>) {
    const interaction = pointerRefs.interactionRef.current;
    if (interaction.type !== "draw") return;

    const end = getCanvasPoint(e);
    if (!end) return;

    const shape = createDrawingShape(end);

    if (shape) {
      pushHistory();
      setShapes((prev) => [...prev, shape]);

      if (selectedTool === "freedraw" || isLocked) {
        setSelectedShapeIds([]);
      } else {
        setSelectedShapeIds((prevIds) => [...prevIds, shape.id]);
      }

      pointerRefs.interactionRef.current = {
        type: "select",
        previewShapes: [shape],
        groupBounds: getGroupBounds([shape]),
      };
    }

    drawingPointsRef.current = [];
    selection.updateSelectionHover(end);
  }

  return { onPointerDownDrawing, onPointerMoveDrawing, onPointerUpDrawing };
}
