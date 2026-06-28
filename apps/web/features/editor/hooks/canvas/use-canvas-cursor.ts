import { RefObject } from "react";
import { ToolType } from "@/types/toolbar.types";
import { getCanvasCursor } from "../../utils/get-canvas-cursor";

interface Props {
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  selectedTool: ToolType;
  isPanningRef: React.RefObject<boolean>;
}

export default function useCanvasCursor({
  overlayCanvasRef,
  selectedTool,
  isPanningRef,
}: Props) {
  function updateCursor(tool: ToolType = selectedTool) {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    canvas.style.cursor = getCanvasCursor(tool, isPanningRef.current);
  }

  function updateResizeCursor(point: Point, shape: Shape) {
    const handle = getResizeHandleAtPoint(
      point,
      shape,
      selectedShapeBounds,
      scale,
    );

    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    if (!handle) {
      canvas.style.cursor = "all-scroll";
      return;
    }

    switch (handle) {
      case "top":
      case "bottom":
        canvas.style.cursor = "ns-resize";
        break;

      case "left":
      case "right":
        canvas.style.cursor = "ew-resize";
        break;

      case "top-left":
      case "bottom-right":
        canvas.style.cursor = "nwse-resize";
        break;

      case "top-right":
      case "bottom-left":
        canvas.style.cursor = "nesw-resize";
        break;

      case "start":
      case "middle":
      case "end":
        canvas.style.cursor = "pointer";
        break;
    }
  }

  return { updateCursor };
}
