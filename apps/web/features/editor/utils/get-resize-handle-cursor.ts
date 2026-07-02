import { ResizeHandleType } from "../types/resize-handle";

export function getResizeHandleCursor(
  handle: Exclude<ResizeHandleType, null>,
): string {
  switch (handle) {
    case "top":
    case "bottom":
      return "ns-resize";

    case "left":
    case "right":
      return "ew-resize";

    case "top-left":
    case "bottom-right":
      return "nwse-resize";

    case "top-right":
    case "bottom-left":
      return "nesw-resize";

    case "start":
    case "middle":
    case "end":
      return "pointer";
  }
}
