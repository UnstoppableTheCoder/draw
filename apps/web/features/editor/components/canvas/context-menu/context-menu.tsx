import { RefObject } from "react";
import { ContextMenuType } from "../../types";
import CanvasContext from "./canvas-context";
import SelectedShapeContext from "./selected-shape-context";
import { usePointerState } from "@/features/editor/hooks/pointer/use-pointer-state";

export function CanvasContextMenu({
  contextMenu,
  pointerRefs,
}: {
  contextMenu: ContextMenuType & {
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  };
  pointerRefs: ReturnType<typeof usePointerState>;
}) {
  return (
    <>
      <SelectedShapeContext
        contextMenu={contextMenu}
        pointerRefs={pointerRefs}
      />
      <CanvasContext contextMenu={contextMenu} />
    </>
  );
}
