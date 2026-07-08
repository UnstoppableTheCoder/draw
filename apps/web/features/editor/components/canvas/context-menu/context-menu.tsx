import { RefObject } from "react";
import { ContextMenuType } from "../../types";
import CanvasContext from "./canvas-context";
import SelectedShapeContext from "./selected-shape-context";

export function CanvasContextMenu({
  contextMenu,
}: {
  contextMenu: ContextMenuType & {
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  };
}) {
  return (
    <>
      <SelectedShapeContext contextMenu={contextMenu} />
      <CanvasContext contextMenu={contextMenu} />
    </>
  );
}
