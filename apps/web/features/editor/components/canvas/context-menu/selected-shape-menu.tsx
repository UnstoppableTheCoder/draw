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
import { ChevronRight } from "lucide-react";
import useSelectionMenuActions from "./use-selection-menu-actions";
import useSelectAllShapes from "@/features/editor/interactions/selection/use-select-all";
import useClipboard from "@/features/editor/interactions/clipboard/use-clipboard";
import { useImageManager } from "@/features/editor/interactions/manager/image-manager";

interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  submenu?: MenuItem[];
  divider?: boolean;
  isDangerous?: boolean;
  disabled?: boolean;
  show?: boolean;
}

export default function SelectedShapeMenu({
  contextMenu: {
    menu: { open, x, y, target },
    closeContextMenu,
    selectionMenuRef,
    overlayCanvasRef,
    pointerRefs,
    imageManager,
  },
}: {
  contextMenu: ContextMenuType & {
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
    pointerRefs: ReturnType<typeof usePointerState>;
    imageManager: ReturnType<typeof useImageManager>;
  };
}) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });

  const hoveredRectRef = useRef<DOMRect | null>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();

  const selected = new Set(selectedShapesIds);

  const deletion = useDeleteShapes(pointerRefs);
  const duplicate = useDuplicateShapes();
  const order = useShapeOrder();
  const actions = useSelectionMenuActions({ overlayCanvasRef, pointerRefs });
  const selection = useSelectAllShapes();
  const clipboard = useClipboard(imageManager);

  const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
  const selectedCount = selectedShapes.length;

  // Condition checks
  const isMultipleShapes = selectedCount > 1;
  const hasFramesIncluded = selectedShapes.some(
    (shape) => shape.type === "frame",
  );
  const hasGroupedShapes = selectedShapes.some((shape) => shape.groupId);
  const showRemoveFrame =
    selectedShapes.some((shape) => shape.type === "frame" || shape.frameId) &&
    !hasGroupedShapes;

  const rawMenuItems: MenuItem[] = [
    { label: "Cut", shortcut: "Ctrl X", action: clipboard.cutShapes },
    { label: "Copy", shortcut: "Ctrl C", action: clipboard.copyShapes },
    { label: "Paste", shortcut: "Ctrl V", action: clipboard.pasteShapes },
    {
      label: "Duplicate",
      shortcut: "Ctrl D",
      action: duplicate.duplicateShapes,
    },
    {
      label: "Select all",
      shortcut: "Ctrl A",
      action: selection.selectAllShapes,
    },
    { label: "divider", divider: true },
    {
      label: "Copy/Paste As",
      submenu: [
        {
          label: "Copy as PNG",
          shortcut: "Alt C",
          action: () => console.log("Copy as PNG"),
          disabled: true,
        },
        {
          label: "Copy as SVG",
          action: () => console.log("Copy as SVG"),
          disabled: true,
        },
        {
          label: "Copy link",
          shortcut: "Ctrl K",
          action: () => console.log("Copy link"),
          disabled: true,
        },
        {
          label: "Copy Markdown embed",
          action: () => console.log("Copy Markdown embed"),
          disabled: true,
        },
        {
          label: "Copy HTML embed",
          action: () => console.log("Copy HTML embed"),
          disabled: true,
        },
        { label: "divider", divider: true },
        {
          label: "Paste styles",
          shortcut: "CtrlAlt V",
          action: () => console.log("Paste styles"),
          disabled: true,
        },
      ],
      disabled: true,
    },
    {
      label: "Export selection",
      action: () => console.log("Export selection"),
      disabled: true,
    },
    { label: "divider", divider: true },
    {
      label: "Add comment",
      shortcut: "Ctrl M",
      action: () => console.log("Add comment"),
      disabled: true,
    },
    {
      label: "Create Frame",
      shortcut: "F",
      action: actions.wrapInFrame,
      show: true,
    },
    {
      label: "Remove Frame",
      shortcut: "F",
      action: actions.removeFrame,
      show: showRemoveFrame,
    },
    {
      label: "Group selection",
      shortcut: "Ctrl G",
      action: actions.group,
      show: isMultipleShapes && !hasFramesIncluded,
    },
    {
      label: "Ungroup selection",
      shortcut: "Ctrl G",
      action: actions.unGroup,
      show: hasGroupedShapes && !hasFramesIncluded,
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
          disabled: true,
        },
        {
          label: "Align right",
          shortcut: "Ctrl →",
          action: () => console.log("Align right"),
          disabled: true,
        },
        {
          label: "Center horizontally",
          action: () => console.log("Center horizontally"),
          disabled: true,
        },
        {
          label: "Distribute horizontally",
          shortcut: "Alt H",
          action: () => console.log("Distribute horizontally"),
          disabled: true,
        },
        { label: "divider", divider: true },
        {
          label: "Align top",
          shortcut: "Ctrl ↑",
          action: () => console.log("Align top"),
          disabled: true,
        },
        {
          label: "Align bottom",
          shortcut: "Ctrl ↓",
          action: () => console.log("Align bottom"),
          disabled: true,
        },
        {
          label: "Center vertically",
          action: () => console.log("Center vertically"),
          disabled: true,
        },
        {
          label: "Distribute vertically",
          shortcut: "Alt V",
          action: () => console.log("Distribute vertically"),
          disabled: true,
        },
      ],
      disabled: true,
    },
    {
      label: "Change Shape",
      action: () => console.log("Change Shape"),
      disabled: true,
    },
    { label: "divider", divider: true },
    {
      label: "Delete",
      shortcut: "",
      isDangerous: true,
      action: deletion.deleteShapes,
    },
  ];

  // Filter out items where `show === false` and clean up consecutive/trailing/leading dividers
  const filterDividers = (items: MenuItem[]) => {
    const filtered = items.filter(
      (item) => item.show === undefined || item.show === true,
    );

    return filtered.filter((item, index, arr) => {
      if (!item.divider) return true;
      if (index === 0) return false;
      if (index === arr.length - 1) return false;
      if (arr[index - 1]?.divider) return false;
      return true;
    });
  };

  const menuItems = filterDividers(rawMenuItems);

  const getSubmenuPosition = (rect: DOMRect) => {
    const padding = 10;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (!submenuRef.current) return { x: 0, y: 0 };

    const submenuWidth = submenuRef.current.offsetWidth;
    const submenuHeight = submenuRef.current.offsetHeight;

    let submenuX = rect.right;
    let submenuY = rect.top;

    if (submenuX + submenuWidth > viewportWidth - padding) {
      submenuX = rect.left - submenuWidth;
    }

    if (submenuY + submenuHeight > viewportHeight - padding) {
      submenuY = Math.max(padding, viewportHeight - submenuHeight - padding);
    }

    return { x: submenuX, y: submenuY };
  };

  const handleMouseEnter = (
    item: MenuItem,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
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
    closeTimeoutRef.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, 150);
  };

  const handleSubmenuEnter = () => {
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
        const isDisabled = item.disabled;

        const baseStyle = item.isDangerous
          ? "text-red-400"
          : "text-neutral-100";
        const bgStyle = isDisabled
          ? "opacity-40 cursor-not-allowed"
          : isHovered
            ? item.isDangerous
              ? "bg-red-900/20 cursor-pointer"
              : "bg-neutral-700/50 cursor-pointer"
            : item.isDangerous
              ? "hover:bg-red-900/20 cursor-pointer"
              : "hover:bg-neutral-700/50 cursor-pointer";

        return (
          <div
            key={item.label}
            onMouseEnter={(e) => !isDisabled && handleMouseEnter(item, e)}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              if (isDisabled) return;
              item.action?.();
              closeContextMenu();
            }}
            className={`px-4 py-2 flex items-center justify-between transition-colors ${baseStyle} ${bgStyle}`}
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
      className="fixed inset-0 z-20"
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
        onClick={(e) => e.stopPropagation()}
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
        onClick={(e) => e.stopPropagation()}
      >
        {renderMenuItems(
          menuItems.find((item) => item.label === openSubmenu)?.submenu || [],
        )}
      </div>
    </div>
  );
}
