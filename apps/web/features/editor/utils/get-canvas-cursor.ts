import { ToolType } from "@/types/toolbar.types";

export function getCanvasCursor(tool: ToolType, isPanning: boolean): string {
  if (isPanning) {
    return "grabbing";
  } else {
    switch (tool) {
      case "pan":
        return isPanning ? "grabbing" : "grab";

      case "select":
        return "default";

      case "text":
        return "text";

      case "eraser":
        return "wait";

      default:
        return "crosshair";
    }
  }
}
