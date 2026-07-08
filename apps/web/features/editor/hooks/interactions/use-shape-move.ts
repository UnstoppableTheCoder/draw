import { Point, Shape } from "../../types/types";
import { usePointerState } from "../pointer/use-pointer-state";
import {
  usePushHistory,
  useSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { RefObject } from "react";
import { useCanvasRenderer } from "../../context/use-renderer";
import { getGroupBounds } from "./use-selection-actions";
import { getGroupedShapes } from "../../transform/get-grouped-shapes";
import { ReceiptTurkishLiraIcon } from "lucide-react";
import { useEditorStore } from "../../store/editor/editor-store";

export default function useShapeMove(
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>,
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const setShapes = useSetShapes();
  const pushHistory = usePushHistory();
  const selectedShapesIds = useSelectedShapesIds();

  const { invalidate, invalidateScene } = useCanvasRenderer();

  function moveShapes(currentPoint: Point) {
    const interaction = pointerRefs.interactionRef.current;
    if (interaction.type !== "move") return;

    let updatedFramedPreviewShapes = interaction.framedPreviewShapes;

    // Update the shapes & frame's child Shapes
    const updatedShapes = interaction.previewShapes.map((shape) => {
      const selectedShapeDragOffset =
        interaction.selectedShapesDragOffsets[shape.id];

      if (!selectedShapeDragOffset) return shape;

      // Update children of the frame
      if (shape.type === "frame" && shape.childIds.length > 0) {
        updatedFramedPreviewShapes = interaction.framedPreviewShapes.map(
          (framedShape) => {
            const framedShapeDragOffset =
              interaction.framedShapesDragOffsets[framedShape.id];

            if (!framedShapeDragOffset) return framedShape;

            return {
              ...framedShape,
              x: currentPoint.x - framedShapeDragOffset.x,
              y: currentPoint.y - framedShapeDragOffset.y,
            };
          },
        );
      }

      return {
        ...shape,
        x: currentPoint.x - selectedShapeDragOffset.x,
        y: currentPoint.y - selectedShapeDragOffset.y,
      };
    });

    pointerRefs.interactionRef.current = {
      ...interaction,
      previewShapes: updatedShapes,
      framedPreviewShapes: updatedFramedPreviewShapes,
      groupedShapes: getGroupedShapes(updatedShapes),
      groupBounds: getGroupBounds(updatedShapes)!,
    };

    invalidate();
  }

  function onPointerUp() {
    const interaction = pointerRefs.interactionRef.current;
    const { isInsideFrame, parentFrameId, selectedShapesIds } =
      useEditorStore.getState();

    if (interaction.type !== "move") return;

    const movedShapes = new Map(
      interaction.previewShapes.map((shape) => [shape.id, shape]),
    );

    const movedFrameChildren = new Map(
      interaction.framedPreviewShapes.map((shape) => [shape.id, shape]),
    );

    setShapes((prev) => {
      // Apply moved positions
      const nextShapes = prev.map((shape) => {
        if (movedFrameChildren.has(shape.id))
          return movedFrameChildren.get(shape.id)!;

        if (movedShapes.has(shape.id)) return movedShapes.get(shape.id)!;

        return { ...shape };
      });

      // Remove selected shapes from every frame
      const selected = new Set(selectedShapesIds);

      for (const shape of nextShapes) {
        if (shape.type !== "frame") continue;

        shape.childIds = shape.childIds.filter((id) => !selected.has(id));
      }

      // Add selected shapes to hovered frame
      if (isInsideFrame && parentFrameId) {
        const frame = nextShapes.find(
          (s) => s.id === parentFrameId && s.type === "frame",
        );

        if (frame && frame.type === "frame") {
          const idsToAdd = selectedShapesIds.filter(
            (id) => id !== parentFrameId,
          );
          frame.childIds = [...new Set([...frame.childIds, ...idsToAdd])];
        }

        for (const shape of nextShapes) {
          if (selected.has(shape.id) && shape.type !== "frame") {
            shape.frameId = parentFrameId;
          }
        }
      } else {
        // Dragged outside every frame
        for (const shape of nextShapes) {
          if (selected.has(shape.id)) {
            shape.frameId = undefined;
          }
        }
      }

      return nextShapes;
    });

    pushHistory();

    pointerRefs.interactionRef.current = {
      type: "select",
      previewShapes: interaction.previewShapes,
      groupedShapes: getGroupedShapes(interaction.previewShapes),
      groupBounds: interaction.groupBounds,
    };

    invalidateScene();
  }

  return {
    moveShapes,
    onPointerUp,
  };
}

// Todo: Do it later
// const dx = currentPoint.x - interaction.initialPointer.x;
// const dy = currentPoint.y - interaction.initialPointer.y;

// const updatedShapes = interaction.initialShapes.map((shape) => ({
//   ...shape,
//   x: shape.x + dx,
//   y: shape.y + dy,
// }));
