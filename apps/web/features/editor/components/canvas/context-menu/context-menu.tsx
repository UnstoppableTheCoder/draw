import { RefObject } from "react";
import { ContextMenuType } from "../../types";
import CanvasContext from "./empty-canvas-menu";
import SelectedShapeContext from "./selected-shape-menu";
import { usePointerState } from "@/features/editor/pointer/use-pointer-state";

export function ContextMenu({
  contextMenu,
}: {
  contextMenu: ContextMenuType & {
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
    pointerRefs: ReturnType<typeof usePointerState>;
  };
}) {
  return (
    <>
      <SelectedShapeContext contextMenu={contextMenu} />
      <CanvasContext contextMenu={contextMenu} />
    </>
  );
}
