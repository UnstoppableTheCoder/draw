import { PointerEvent, RefObject } from "react";
import * as store from "../../store/editor/selectors";
import { Point, PointTuple } from "../../types/types";
import { useCanvasRenderer } from "../../context/use-renderer";
import {
  useBackgroundColor,
  useOpacity,
  useRoundness,
  useStrokeColor,
  useStrokeStyle,
  useStrokeWidth,
} from "../../store/properties/selectors";
import { getFrameAtPosition } from "../shared/get-frame-at-position";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import { computeDrawingPoints } from "./compute-drawing-points";
import useSelectionActions from "../selection/use-selection";
import { usePointerState } from "../../pointer/use-pointer-state";
import { createShape } from "./create-shape";
import { Shape } from "../../types";

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
  const shapes = store.useShapes();
  const scale = store.useScale();
  const selectedTool = store.useSelectedTool();
  const selectedShapesIds = store.useSelectedShapesIds();
  const setSelectedShapesIds = store.useSetSelectedShapesIds();
  const pushHistory = store.usePushHistory();
  const isLocked = store.useIsLocked();
  const setHoveredFrameId = store.useSetHoveredFrameId();
  const hoveredFrameId = store.useHoveredFrameId();

  // Styles
  const strokeColor = useStrokeColor();
  const backgroundColor = useBackgroundColor();
  const strokeWidth = useStrokeWidth();
  const strokeStyle = useStrokeStyle();
  const roundness = useRoundness();
  const opacity = useOpacity();

  const { clientToCanvas } = useViewportHelpers(overlayCanvasRef);
  const { invalidateOverlay, invalidateScene } = useCanvasRenderer();
  const selection = useSelectionActions({
    sceneCanvasRef,
    overlayCanvasRef,
    pointerRefs,
  });

  function createDrawingShape(end: Point) {
    if (!drawingStartRef.current) return null;

    return createShape({
      tool: selectedTool,
      startPoint: drawingStartRef.current,
      endPoint: end,
      points: drawingPointsRef.current,
      style: {
        strokeColor,
        backgroundColor,
        strokeWidth,
        strokeStyle,
        roundness,
        opacity,
      },
    });
  }

  function handleShapeDrawingOverFrame(start: Point) {
    const hoveredFrame = getFrameAtPosition({
      point: start,
      shapes,
      scale,
    });

    if (hoveredFrame) {
      invalidateScene();
    }

    setHoveredFrameId(hoveredFrame?.id ?? null);
  }

  // Sets Initial Point on Pointer Down - for Shapes With Points
  function onPointerDownDrawing(e: PointerEvent<HTMLCanvasElement>) {
    if (pointerRefs.interactionRef.current.type !== "draw") return;
    const point = clientToCanvas(e.clientX, e.clientY);

    drawingStartRef.current = point;
    drawingPointsRef.current = [[0, 0]];
  }

  // Handles Drawing During Mouse Move
  function onPointerMoveDrawing(e: React.PointerEvent<HTMLCanvasElement>) {
    const interaction = pointerRefs.interactionRef.current;
    if (interaction.type !== "draw") return;

    const start = drawingStartRef.current;
    if (!start) return;

    const end = clientToCanvas(e.clientX, e.clientY);
    if (!end) return;

    const relativePoint: PointTuple = [end.x - start.x, end.y - start.y];

    drawingPointsRef.current = computeDrawingPoints({
      tool: selectedTool,
      relativePoint,
      currentPoints: drawingPointsRef.current,
    });

    const shape = createDrawingShape(end);
    if (!shape) return;

    interaction.previewShape = shape;

    // UI of the frame
    handleShapeDrawingOverFrame(start);

    invalidateOverlay();
  }

  // Saves the Shapes
  function onPointerUpDrawing(e: PointerEvent<HTMLCanvasElement>) {
    const interaction = pointerRefs.interactionRef.current;
    if (interaction.type !== "draw") return;

    const end = clientToCanvas(e.clientX, e.clientY);
    if (!end) return;

    const createdShape = createDrawingShape(end);
    if (!createdShape) return;

    const shape: Shape = {
      ...createdShape,
      frameId: hoveredFrameId,
    };

    if (shape) {
      setShapes((prev) => [...prev, shape]);
      pushHistory();

      if (selectedTool === "freedraw" || isLocked) {
        setSelectedShapesIds([]);
      } else {
        setSelectedShapesIds((prevIds) => [...prevIds, shape.id]);
      }

      pointerRefs.interactionRef.current = {
        ...interaction,
        type: "select",
        previewShapes: [shape],
        selectedShapesIds: new Set(selectedShapesIds),
      };
    }

    drawingPointsRef.current = [];
    selection.updateSelectionHover(end);
    setHoveredFrameId(null);
  }

  return { onPointerDownDrawing, onPointerMoveDrawing, onPointerUpDrawing };
}
