import { RefObject, useEffect } from "react";
import { ToolType } from "@/types/toolbar";
import { getCanvasCursor } from "./get-canvas-cursor";
import { Point, Shape } from "../../types/types";
import { useScale, useSelectedTool } from "../../store/editor/selectors";
import { getResizeHandleAtPoint } from "../../geometry/resize-handles/get-resize-handle-at-point";
import { isPointInSelectedShapeBounds } from "../../geometry/hit-test/is-point-in-selected-bounds";
import { getResizeHandleCursor } from "../../interactions/resize/get-resize-handle-cursor";
import { useEditorStore } from "../../store/editor/editor-store";
import { getGroupBounds } from "../../geometry/bounding-box/get-group-bounds";
import { usePointerState } from "../../pointer/use-pointer-state";

interface Props {
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
}

export default function useCanvasCursor({
  overlayCanvasRef,
  pointerRefs,
}: Props) {
  const selectedTool = useSelectedTool();
  const scale = useScale();

  function getSelectionCursor(
    point: Point,
    selectedShapes: Shape[],
  ): string | null {
    const groupBounds = getGroupBounds(selectedShapes);
    if (!groupBounds) return null;

    const handle = getResizeHandleAtPoint({
      point,
      shapes: selectedShapes,
      bounds: groupBounds,
      scale,
    });

    if (handle) {
      return getResizeHandleCursor(handle);
    }

    if (isPointInSelectedShapeBounds(point, groupBounds)) {
      return "move";
    }

    return null;
  }

  function updateCursor(tool: ToolType = selectedTool) {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    canvas.style.cursor = getCanvasCursor(
      tool,
      pointerRefs.isPanningRef.current,
    );
  }

  function updateHoverCursor(point: Point, hoveredShape: Shape | undefined) {
    const { selectedShapesIds, shapes } = useEditorStore.getState();
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const selectedShapeMap = new Set(selectedShapesIds);

    const selectedShapes = shapes.filter((shape) =>
      selectedShapeMap.has(shape.id),
    );

    const selectionCursor = getSelectionCursor(point, selectedShapes);

    if (selectionCursor) {
      canvas.style.cursor = selectionCursor;
      return;
    }

    if (hoveredShape) {
      canvas.style.cursor = "move";
      return;
    }

    updateCursor();
  }

  // Updates the cursor type when tool changes
  useEffect(() => {
    updateCursor(selectedTool);
  }, [selectedTool]);

  return {
    updateCursor,
    updateHoverCursor,
  };
}
