import { RefObject } from "react";
import { ToolType } from "@/types/toolbar.types";
import { getCanvasCursor } from "../../utils/get-canvas-cursor";

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  selectedTool: ToolType;
  isPanningRef: React.RefObject<boolean>;
}

export default function useCanvasCursor({
  canvasRef,
  selectedTool,
  isPanningRef,
}: Props) {
  function updateCursor(tool: ToolType = selectedTool) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.cursor = getCanvasCursor(tool, isPanningRef.current);
  }

  return { updateCursor };
}
