import { MouseEvent, RefObject } from "react";

export type Menu = {
  open: boolean;
  x: number;
  y: number;
  clickedInSelectedArea: boolean;
};

export type ContextMenuType = {
  selectedShapeContextRef: RefObject<HTMLDivElement | null>;
  canvasContextRef: RefObject<HTMLDivElement | null>;
  menu: Menu;
  openContextMenu: (e: MouseEvent<HTMLCanvasElement>) => void;
  closeContextMenu: () => void;
  updateContextMenu: (value: boolean) => void;
};
