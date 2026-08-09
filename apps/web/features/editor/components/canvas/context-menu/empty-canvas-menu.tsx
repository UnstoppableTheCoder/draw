import { RefObject } from "react";
import MenuButton from "./menu-button";
import { ContextMenuType } from "../../types";
import { Separator } from "@/components/ui/separator";
import { useImageManager } from "@/features/editor/interactions/manager/image-manager";
import useSelectAllShapes from "@/features/editor/interactions/selection/use-select-all";
import { usePointerState } from "@/features/editor/pointer/use-pointer-state";
import useClipboard from "@/features/editor/interactions/clipboard/use-clipboard";

interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

export default function EmptyCanvasMenu({
  contextMenu: {
    menu: { open, x, y, target },
    closeContextMenu,
    canvasMenuRef,
    overlayCanvasRef,
    pointerRefs,
  },
}: {
  contextMenu: ContextMenuType & {
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
    pointerRefs: ReturnType<typeof usePointerState>;
  };
}) {
  const selection = useSelectAllShapes();
  const clipboard = useClipboard();

  const menuItems: MenuItem[] = [
    {
      label: "Paste",
      shortcut: "Ctrl+V",
      action: clipboard.pasteShapes,
    },

    { label: "divider", divider: true },

    {
      label: "Copy to clipboard as PNG",
      shortcut: "Shift+Alt+C",
      disabled: true,
    },
    {
      label: "Copy to clipboard as SVG",
      disabled: true,
    },

    { label: "divider", divider: true },

    {
      label: "Select all",
      shortcut: "Ctrl+A",
      action: selection.selectAllShapes,
    },

    { label: "divider", divider: true },

    {
      label: "Toggle grid",
      shortcut: "Ctrl+'",
      action: () => {
        // toggleGrid();
      },
    },
    {
      label: "Snap to objects",
      shortcut: "Alt+S",
      disabled: true,
    },
    {
      label: "Arrow binding",
      disabled: true,
    },
    {
      label: "Snap to midpoints",
      disabled: true,
    },
    {
      label: "Zen mode",
      shortcut: "Alt+Z",
      action: () => {
        // toggleZenMode();
      },
    },
    {
      label: "View mode",
      shortcut: "Alt+R",
      action: () => {
        // toggleViewMode();
      },
    },
    {
      label: "Canvas & Shape properties",
      shortcut: "Alt+/",
      disabled: true,
    },
  ];

  return (
    <div
      className="fixed z-20 min-w-50 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        left: x,
        top: y,
        visibility: open && target === "canvas" ? "visible" : "hidden",
      }}
      ref={canvasMenuRef}
    >
      {menuItems.map((item, index) => {
        if (item.divider) {
          return <Separator key={`divider-${index}`} />;
        }

        return (
          <MenuButton
            key={item.label}
            shortcut={item.shortcut}
            disabled={item.disabled}
            onClick={() => {
              item.action?.();
              closeContextMenu();
            }}
          >
            {item.label}
          </MenuButton>
        );
      })}
    </div>
  );
}
