import { MouseEvent, RefObject } from "react";
import MenuButton from "./menu-button";
import { ContextMenuType } from "../../types";
import { Separator } from "@/components/ui/separator";

export default function EmptyCanvasMenu({
  contextMenu: {
    menu: { open, x, y, target },
    closeContextMenu,
    canvasMenuRef,
    overlayCanvasRef,
  },
}: {
  contextMenu: ContextMenuType & {
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  };
}) {
  return (
    <div
      className="fixed z-50 min-w-50 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        left: x,
        top: y,
        visibility: open && target === "canvas" ? "visible" : "hidden",
      }}
      ref={canvasMenuRef}
    >
      <MenuButton shortcut="Ctrl+V">Paste</MenuButton>

      <Separator />

      <MenuButton shortcut="Shift+Alt+C">Copy to clipboard as PNG</MenuButton>
      <MenuButton>Copy to clipboard as SVG</MenuButton>

      <Separator />

      <MenuButton shortcut="Ctrl+A">Select all</MenuButton>

      <Separator />

      <MenuButton shortcut="Ctrl+'">Toggle grid</MenuButton>
      <MenuButton shortcut="Alt+S">Snap to objects</MenuButton>
      <MenuButton>Arrow binding</MenuButton>
      <MenuButton>Snap to midpoints</MenuButton>
      <MenuButton shortcut="Alt+Z">Zen mode</MenuButton>
      <MenuButton shortcut="Alt+R">View mode</MenuButton>
      <MenuButton shortcut="Alt+/">Canvas & Shape properties</MenuButton>
    </div>
  );
}
