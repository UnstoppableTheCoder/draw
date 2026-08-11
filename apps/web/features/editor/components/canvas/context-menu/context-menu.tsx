import { RefObject } from "react";
import { ContextMenuType } from "../../types";
import { usePointerState } from "@/features/editor/pointer/use-pointer-state";
import { useImageManager } from "@/features/editor/interactions/manager/image-manager";
import EmptyCanvasMenu from "./empty-canvas-menu";
import SelectedShapeMenu from "./selected-shape-menu";

export function ContextMenu({
  contextMenu,
}: {
  contextMenu: ContextMenuType & {
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
    pointerRefs: ReturnType<typeof usePointerState>;
    imageManager: ReturnType<typeof useImageManager>
  };
}) {
  return (
    <>
      <SelectedShapeMenu contextMenu={contextMenu} />
      <EmptyCanvasMenu contextMenu={contextMenu} />
    </>
  );
}
