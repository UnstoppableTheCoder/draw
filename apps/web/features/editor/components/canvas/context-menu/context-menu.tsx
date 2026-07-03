import { ContextMenuType } from "../../types";
import CanvasContext from "./canvas-context";
import SelectedShapeContext from "./selected-shape-context";

export function CanvasContextMenu({
  contextMenu,
}: {
  contextMenu: ContextMenuType;
}) {
  return (
    <>
      <SelectedShapeContext contextMenu={contextMenu} />
      <CanvasContext contextMenu={contextMenu} />
    </>
  );
}
