import { MouseEvent, RefObject } from "react";
import MenuButton from "./menu-button";
import { ContextMenuType, Menu } from "../../types";
import { Separator } from "../../ui/separator";

export default function selectedShapeContext({
  contextMenu: {
    menu: { open, x, y, clickedInSelectedArea },
    closeContextMenu,
    selectedShapeContextRef,
  },
}: {
  contextMenu: ContextMenuType;
}) {
  return (
    <div
      className="fixed z-50 min-w-50 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        left: x,
        top: y,
        visibility: open && clickedInSelectedArea ? "visible" : "hidden",
      }}
      ref={selectedShapeContextRef}
    >
      <MenuButton shortcut="Ctrl+X">Cut</MenuButton>
      <MenuButton shortcut="Ctrl+C">Copy</MenuButton>
      <MenuButton shortcut="Ctrl+V">Paste</MenuButton>

      <Separator />

      <MenuButton>Wrap selection in frame</MenuButton>

      <Separator />

      <MenuButton shortcut="Shift+Alt+C">Copy to clipboard as PNG</MenuButton>
      <MenuButton>Copy to clipboard as SVG</MenuButton>

      <Separator />

      <MenuButton shortcut="Ctrl+Alt+C">Copy Styles</MenuButton>
      <MenuButton shortcut="Ctrl+Alt+V">Paste Styles</MenuButton>

      <Separator />

      <MenuButton>Add to library</MenuButton>

      <Separator />

      <MenuButton shortcut="Shift+H">Flip horizontal</MenuButton>
      <MenuButton shortcut="Shift+V">Flip vertical</MenuButton>

      <Separator />

      <MenuButton shortcut="Ctrl+K">Add link</MenuButton>
      <MenuButton>Copy link to object</MenuButton>

      <Separator />
      <MenuButton shortcut="Ctrl+D">Duplicate</MenuButton>
      <MenuButton shortcut="Ctrl+Shift+L">Lock</MenuButton>

      <Separator />

      <MenuButton destructive shortcut="⌫ | Delete">
        Delete
      </MenuButton>
    </div>
  );
}
