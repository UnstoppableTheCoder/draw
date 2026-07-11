import { ContextMenuType } from "../../types";
import useDeleteShapes from "@/features/editor/interactions/selection/use-delete-shapes";
import useDuplicateShapes from "@/features/editor/interactions/selection/use-duplicate-shapes";
import useShapeOrder from "@/features/editor/interactions/order/use-shape-order";
import {
  useSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "@/features/editor/store/editor/selectors";
import { useCanvasRenderer } from "@/features/editor/context/use-renderer";
import { RefObject, useLayoutEffect, useRef, useState } from "react";
import { usePointerState } from "@/features/editor/pointer/use-pointer-state";
import { ChevronRight, Trash2 } from "lucide-react";
import useSelectionMenuActions from "./use-selection-menu-actions";

interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  submenu?: MenuItem[];
  divider?: boolean;
  isDangerous?: boolean;
}

export default function SelectedShapeMenu({
  contextMenu: {
    menu: { open, x, y, target },
    closeContextMenu,
    selectionMenuRef,
    overlayCanvasRef,
    pointerRefs,
  },
}: {
  contextMenu: ContextMenuType & {
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
    pointerRefs: ReturnType<typeof usePointerState>;
  };
}) {
  // Use string labels instead of objects for cleaner state management
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });

  const hoveredRectRef = useRef<DOMRect | null>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setShapes = useSetShapes();
  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();

  const selected = new Set(selectedShapesIds);
  const { invalidate } = useCanvasRenderer();

  const deletion = useDeleteShapes(pointerRefs);
  const duplicate = useDuplicateShapes();
  const order = useShapeOrder();
  const actions = useSelectionMenuActions({ overlayCanvasRef, pointerRefs });

  const menuItems: MenuItem[] = [
    { label: "Cut", shortcut: "Ctrl X", action: () => console.log("Cut") },
    { label: "Copy", shortcut: "Ctrl C", action: () => console.log("Copy") },
    { label: "Paste", shortcut: "Ctrl V", action: () => console.log("Paste") },
    {
      label: "Duplicate",
      shortcut: "Ctrl D",
      action: duplicate.duplicateShapes,
    },
    {
      label: "Select all",
      shortcut: "Ctrl A",
      action: () => console.log("Select all"),
    },
    { label: "divider", divider: true },
    {
      label: "Copy/Paste As",
      submenu: [
        {
          label: "Copy as PNG",
          shortcut: "Alt C",
          action: () => console.log("Copy as PNG"),
        },
        { label: "Copy as SVG", action: () => console.log("Copy as SVG") },
        {
          label: "Copy link",
          shortcut: "Ctrl K",
          action: () => console.log("Copy link"),
        },
        {
          label: "Copy Markdown embed",
          action: () => console.log("Copy Markdown embed"),
        },
        {
          label: "Copy HTML embed",
          action: () => console.log("Copy HTML embed"),
        },
        { label: "divider", divider: true },
        {
          label: "Paste styles",
          shortcut: "CtrlAlt V",
          action: () => console.log("Paste styles"),
        },
      ],
    },
    {
      label: "Export selection",
      action: () => console.log("Export selection"),
    },
    { label: "divider", divider: true },
    {
      label: "Add comment",
      shortcut: "Ctrl M",
      action: () => console.log("Add comment"),
    },
    {
      label: "Create Frame",
      shortcut: "F",
      action: actions.wrapInFrame,
    },
    {
      label: "Remove Frame",
      shortcut: "F",
      action: actions.wrapInFrame,
    },
    {
      label: "Group selection",
      shortcut: "Ctrl G",
      action: actions.group,
    },
    {
      label: "Ungroup selection",
      shortcut: "Ctrl G",
      action: () => console.log("Ungroup selection"),
    },
    { label: "divider", divider: true },
    {
      label: "Change Order",
      submenu: [
        {
          label: "Send backward",
          shortcut: "Ctrl [",
          action: order.sendBackward,
        },
        {
          label: "Bring forward",
          shortcut: "Ctrl ]",
          action: order.bringForward,
        },
        {
          label: "Send to back",
          shortcut: "[",
          action: order.sendToBack,
        },
        {
          label: "Bring to front",
          shortcut: "]",
          action: order.bringToFront,
        },
      ],
    },
    {
      label: "Align",
      submenu: [
        {
          label: "Align left",
          shortcut: "Ctrl ←",
          action: () => console.log("Align left"),
        },
        {
          label: "Align right",
          shortcut: "Ctrl →",
          action: () => console.log("Align right"),
        },
        {
          label: "Center horizontally",
          action: () => console.log("Center horizontally"),
        },
        {
          label: "Distribute horizontally",
          shortcut: "Alt H",
          action: () => console.log("Distribute horizontally"),
        },
        { label: "divider", divider: true },
        {
          label: "Align top",
          shortcut: "Ctrl ↑",
          action: () => console.log("Align top"),
        },
        {
          label: "Align bottom",
          shortcut: "Ctrl ↓",
          action: () => console.log("Align bottom"),
        },
        {
          label: "Center vertically",
          action: () => console.log("Center vertically"),
        },
        {
          label: "Distribute vertically",
          shortcut: "Alt V",
          action: () => console.log("Distribute vertically"),
        },
      ],
    },
    { label: "Change Shape", action: () => console.log("Change Shape") },
    { label: "divider", divider: true },
    {
      label: "Delete",
      shortcut: "",
      isDangerous: true,
      action: deletion.deleteShapes,
    },
  ] as const;

  const getSubmenuPosition = (rect: DOMRect) => {
    const padding = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (!submenuRef.current) return { x: 0, y: 0 };

    const submenuWidth = submenuRef.current.offsetWidth;
    const submenuHeight = submenuRef.current.offsetHeight;

    let submenuX = rect.right;
    let submenuY = rect.top;

    // Flip horizontally if goes off right edge
    if (submenuX + submenuWidth > viewportWidth - padding) {
      submenuX = rect.left - submenuWidth;
    }

    // Adjust vertically if goes off bottom edge
    if (submenuY + submenuHeight > viewportHeight - padding) {
      submenuY = Math.max(padding, viewportHeight - submenuHeight - padding);
    }

    return { x: submenuX, y: submenuY };
  };

  const handleMouseEnter = (
    item: MenuItem,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setHoveredItem(item.label);

    if (item.submenu) {
      hoveredRectRef.current = event.currentTarget.getBoundingClientRect();
      setOpenSubmenu(item.label);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    // Delay closing to allow smooth transition to submenu
    closeTimeoutRef.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, 150);
  };

  const handleSubmenuEnter = () => {
    // Clear timeout when entering submenu to keep it open
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleSubmenuLeave = () => {
    setOpenSubmenu(null);
  };

  const renderMenuItems = (items: MenuItem[]) => (
    <div className="py-1">
      {items.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={`divider-${index}`}
              className="h-px bg-neutral-700 my-1"
            />
          );
        }

        const isHovered = hoveredItem === item.label;
        const baseStyle = item.isDangerous
          ? "text-red-400"
          : "text-neutral-100";
        const bgStyle = isHovered
          ? item.isDangerous
            ? "bg-red-900/20"
            : "bg-neutral-700/50"
          : item.isDangerous
            ? "hover:bg-red-900/20"
            : "hover:bg-neutral-700/50";

        return (
          <div
            key={item.label}
            onMouseEnter={(e) => handleMouseEnter(item, e)}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              item.action?.();
              closeContextMenu();
            }}
            className={`px-4 py-2 flex items-center justify-between cursor-pointer transition-colors ${baseStyle} ${bgStyle}`}
          >
            <span>{item.label}</span>
            <div className="flex items-center gap-2">
              {item.submenu && (
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              )}
              {item.shortcut && (
                <span className="text-xs text-neutral-500 ml-4">
                  {item.shortcut}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  useLayoutEffect(() => {
    if (!hoveredRectRef.current || !openSubmenu) return;
    const position = getSubmenuPosition(hoveredRectRef.current);
    setSubmenuPosition(position);
  }, [openSubmenu]);

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={closeContextMenu}
      style={{
        visibility: target !== "selection" || !open ? "hidden" : undefined,
      }}
    >
      {/* Main Menu */}
      <div
        ref={selectionMenuRef}
        className="absolute bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl min-w-64"
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        {renderMenuItems(menuItems)}
      </div>

      {/* Submenu */}
      <div
        ref={submenuRef}
        className="absolute bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl min-w-64"
        style={{
          left: `${submenuPosition.x}px`,
          top: `${submenuPosition.y}px`,
          visibility: !openSubmenu ? "hidden" : undefined,
        }}
        onMouseEnter={handleSubmenuEnter}
        onMouseLeave={handleSubmenuLeave}
      >
        {renderMenuItems(
          menuItems.find((item) => item.label === openSubmenu)?.submenu || [],
        )}
      </div>
    </div>
  );
}
