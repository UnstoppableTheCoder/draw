import { LucideIcon } from "lucide-react";

export type ToolType =
  | "pan"
  | "select"
  | "rectangle"
  | "diamond"
  | "ellipse"
  | "arrow"
  | "line"
  | "freedraw"
  | "text"
  | "image"
  | "eraser";

export type CursorType =
  | "default"
  | "crosshair"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "text";

export type ToolbarStateType = {
  tool: ToolType;
  lock: boolean;
};

export type SetToolPayloadType = {
  tool: ToolType;
};

export type SetLockPayloadType = {
  lock: boolean;
};

export type ToolbarItemType = {
  tool: ToolType;
  icon: LucideIcon;
  label: string;
};
