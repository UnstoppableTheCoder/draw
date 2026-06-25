import { ToolType } from "@/types/toolbar.types";

export function getCanvasCursor(tool: ToolType, isPanning: boolean): string {
  switch (tool) {
    case "pan":
      return isPanning ? "grabbing" : "grab";

    case "select":
      return "default";

    case "text":
      return "text";

    case "eraser":
      return "progress";

    default:
      return "crosshair";
  }
}
