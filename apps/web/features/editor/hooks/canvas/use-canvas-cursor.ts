import { RefObject } from "react";
import { ToolType } from "@/types/toolbar.types";
import { getCanvasCursor } from "../../utils/get-canvas-cursor";
import { Point, Shape } from "../../types/types";
import {
  getBoundingBox,
  getResizeHandleAtPoint,
} from "../../geometry/bounding-box";
import {
  useScale,
  useSelectedShape,
  useSelectedTool,
} from "../../store/selectors";
import { usePointerState } from "../pointer/use-pointer-state";

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
  const selectedShape = useSelectedShape();

  function updateCursor(tool: ToolType = selectedTool) {
    const isPanningRef = pointerRefs.isPanningRef;
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    canvas.style.cursor = getCanvasCursor(tool, isPanningRef.current);
  }

  function updateHoverCursor(point: Point, shape: Shape) {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const isSelected = selectedShape?.id === shape.id;

    if (isSelected) {
      const bounds = getBoundingBox(shape);

      const handle = getResizeHandleAtPoint({
        point,
        shape,
        bounds,
        scale,
      });

      if (handle) {
        switch (handle) {
          case "top":
          case "bottom":
            canvas.style.cursor = "ns-resize";
            return;

          case "left":
          case "right":
            canvas.style.cursor = "ew-resize";
            return;

          case "top-left":
          case "bottom-right":
            canvas.style.cursor = "nwse-resize";
            return;

          case "top-right":
          case "bottom-left":
            canvas.style.cursor = "nesw-resize";
            return;

          case "start":
          case "middle":
          case "end":
            canvas.style.cursor = "pointer";
            return;
        }
      }
    }

    canvas.style.cursor = "move";
  }

  return { updateCursor, updateHoverCursor };
}
