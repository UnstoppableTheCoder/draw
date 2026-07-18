import { Point, PointTuple } from "../../types/types";
import { RefObject } from "react";
import {
  usePushHistory,
  useSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { getResizeRect } from "./get-resize-rect";
import { resizeFreeDrawShape } from "./resize-freedraw";
import resizeTextShape from "./resize-text";
import { resizeLineShape } from "./resize-line";
import {
  getGroupScale,
  getScaledShapeRect,
  getShapeBounds,
  scalePointInGroup,
} from "./scale-shape-in-group";
import { useCanvasRenderer } from "../../context/use-renderer";
import { usePointerState } from "../../pointer/use-pointer-state";
import { updateShapes } from "../../networking/api/shape-api";
import { useParams } from "next/navigation";
import { Shape } from "../../types";
import { useEditorStore } from "../../store/editor/editor-store";

function isLineEndpointHandle(
  handle: string | null,
): handle is "start" | "end" {
  return handle === "start" || handle === "end";
}

export default function useShapeResize(
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const { pageId } = useParams<{ pageId: string }>();

  const pushHistory = usePushHistory();
  const setShapes = useSetShapes();
  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();
  const selected = new Set(selectedShapesIds);
  const selectedShapes = shapes.filter((shape) => selected.has(shape.id));

  const { invalidateOverlay, invalidateScene } = useCanvasRenderer();

  const resizeShapes = (currentPoint: Point) => {
    const interaction = pointerRefs.interactionRef.current;

    if (interaction.type !== "resize") {
      return;
    }

    const {
      previewShapes,
      initialShapes,
      handle,
      initialGroupBounds,
      initialFontSizes,
      freeDrawPoints,
      lineResizeStates,
    } = interaction;

    const rect = getResizeRect({
      handle,
      currentPoint,
      initialBounds: initialGroupBounds,
    });

    const isGroupSelection = previewShapes.length > 1;
    const initialShapeMap = new Map(
      initialShapes.map((shape) => [shape.id, shape]),
    );

    const ctx = overlayCanvasRef.current?.getContext("2d");

    const isTextSelected = selectedShapes.some(
      (shape) => shape.type === "text",
    );

    const updatedShapes = previewShapes.map((shape) => {
      const initialShape = initialShapeMap.get(shape.id);
      if (!initialShape) return shape;

      switch (shape.type) {
        case "line":
        case "arrow": {
          const lineState = lineResizeStates?.[shape.id];
          if (!lineState) return shape;

          if (isLineEndpointHandle(handle)) {
            return resizeLineShape({
              shape,
              currentPoint,
              handle,
              lineResizeState: lineState,
            });
          }

          if (!rect || !isGroupSelection) return shape;
          const groupScale = getGroupScale(initialGroupBounds, rect);
          const groupHeightScaledRatio = groupScale.scaleY;

          const start = scalePointInGroup(
            lineState.start,
            initialGroupBounds,
            rect,
            isTextSelected ? groupHeightScaledRatio : undefined,
          );

          const end = scalePointInGroup(
            lineState.end,
            initialGroupBounds,
            rect,
            isTextSelected ? groupHeightScaledRatio : undefined,
          );

          return {
            ...shape,
            x: start.x,
            y: start.y,
            data: {
              points: [
                [0, 0],
                [end.x - start.x, end.y - start.y],
              ] as PointTuple[],
            },
          };
        }

        case "freedraw": {
          const points = freeDrawPoints?.[shape.id];
          if (!points || !rect) return shape;

          const groupScale = getGroupScale(initialGroupBounds, rect);
          const groupHeightScaledRatio = groupScale.scaleY;

          return resizeFreeDrawShape({
            shape,
            rect,
            initialGroupBounds,
            freeDrawPoints: points,
            scale: isTextSelected ? groupHeightScaledRatio : undefined,
          });
        }

        case "text": {
          const fontSize = initialFontSizes?.[shape.id];

          if (!fontSize || !ctx || !rect) return shape;

          const groupScale = getGroupScale(initialGroupBounds, rect);
          const groupHeightScaledRatio = groupScale.scaleY;

          const shapeRect = isGroupSelection
            ? getScaledShapeRect(
                initialShape,
                initialGroupBounds,
                rect,
                isTextSelected ? groupHeightScaledRatio : undefined,
              )
            : rect;

          return resizeTextShape({
            ctx,
            shape,
            rect: shapeRect,
            initialBounds: isGroupSelection
              ? getShapeBounds(initialShape)
              : initialGroupBounds,
            initialFontSize: fontSize,
            scale: isTextSelected ? groupHeightScaledRatio : undefined,
          });
        }

        default:
          if (!rect) return shape;

          const groupScale = getGroupScale(initialGroupBounds, rect);
          const groupHeightScaledRatio = groupScale.scaleY;

          const shapeRect = isGroupSelection
            ? getScaledShapeRect(
                initialShape,
                initialGroupBounds,
                rect,
                isTextSelected ? groupHeightScaledRatio : undefined,
              )
            : rect;

          return {
            ...shape,
            ...shapeRect,
          };
      }
    });

    pointerRefs.interactionRef.current = {
      ...interaction,
      previewShapes: updatedShapes,
    };

    invalidateOverlay();
  };

  const onPointerUp = async () => {
    const interaction = pointerRefs.interactionRef.current;
    const currentShapes = useEditorStore.getState().shapes;

    if (interaction.type !== "resize") return;

    const resizeShapesMap = new Map(
      interaction.previewShapes.map((shape) => [shape.id, shape]),
    );

    const finalShapes: Shape[] = currentShapes.map(
      (shape) => resizeShapesMap.get(shape.id) ?? shape,
    );

    setShapes(finalShapes);
    pushHistory();

    pointerRefs.interactionRef.current = {
      ...interaction,
      type: "select",
      previewShapes: interaction.previewShapes,
      selectedShapesIds: new Set(selectedShapesIds),
    };

    invalidateScene();

    try {
      await updateShapes(pageId, interaction.previewShapes);
    } catch {
      // Rollback
      setShapes(currentShapes);
    }
  };

  return {
    resizeShapes,
    onPointerUp,
  };
}
