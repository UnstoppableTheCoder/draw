import { ToolbarItemType } from "@/types/toolbar.types";
import {
  Circle,
  Diamond,
  Ellipse,
  Eraser,
  Hand,
  Image,
  Lock,
  Minus,
  MoreHorizontal,
  MousePointer,
  MoveRight,
  Pencil,
  Square,
  Type,
} from "lucide-react";

export const toolbarItems: ToolbarItemType[] = [
  {
    tool: "pan",
    icon: Hand,
    label: "Pan",
  },
  {
    tool: "select",
    icon: MousePointer,
    label: "Select",
  },
  {
    tool: "rectangle",
    icon: Square,
    label: "Rectangle",
  },
  {
    tool: "diamond",
    icon: Diamond,
    label: "Diamond",
  },
  {
    tool: "ellipse",
    icon: Ellipse,
    label: "Ellipse",
  },
  {
    tool: "arrow",
    icon: MoveRight,
    label: "Arrow",
  },
  {
    tool: "line",
    icon: Minus,
    label: "Line",
  },
  {
    tool: "freedraw",
    icon: Pencil,
    label: "Draw",
  },
  {
    tool: "text",
    icon: Type,
    label: "Text",
  },
  {
    tool: "image",
    icon: Image,
    label: "Insert Image",
  },
  {
    tool: "eraser",
    icon: Eraser,
    label: "Eraser",
  },
];
