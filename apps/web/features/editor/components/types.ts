import { MouseEvent, ReactNode, RefObject } from "react";
import { usePointerState } from "../pointer/use-pointer-state";
import useContextMenu from "./canvas/context-menu/use-context-menu";

export type Menu = {
  open: boolean;
  x: number;
  y: number;
  clickedInSelectedArea: boolean;
};

export type ContextMenuType = ReturnType<typeof useContextMenu>;

export type StrokeWidthType = "thin" | "medium" | "bold" | "extrabold";

export type PropertiesDataType = {
  label: string;
  value?: string;
  icon: ReactNode;
};

export type EditorRefs = {
  backgroundRefs: RefObject<HTMLCanvasElement | null>;
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
};
