import { MouseEvent, RefObject, useEffect, useRef, useState } from "react";

import { getGroupBounds } from "../../../geometry/bounding-box/get-group-bounds";
import { getShapeAtPosition } from "../../../geometry/hit-test/get-shape-at-position";
import { isPointInSelectedShapeBounds } from "../../../geometry/hit-test/is-point-in-selected-bounds";
import useViewportHelpers from "../../../interactions/viewport/use-viewport-helpers";
import { useCanvasRenderer } from "../../../context/use-renderer";
import {
  useScale,
  useSelectedShapesIds,
  useSetSelectedShapesIds,
  useShapes,
} from "../../../store/editor/selectors";
import { WINDOW_PADDING } from "@/features/editor/constants/context";

type MenuTarget = "canvas" | "selection";

type MenuState = {
  open: boolean;
  x: number;
  y: number;
  target: MenuTarget;
};

interface MenuItem {
  label: string;
  shortcut?: string;
  action?: () => void;
  submenu?: MenuItem[];
  divider?: boolean;
  isDangerous?: boolean;
}

const DEFAULT_MENU_STATE: MenuState = {
  open: false,
  x: 0,
  y: 0,
  target: "canvas",
};

export default function useContextMenu(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const [menu, setMenu] = useState(DEFAULT_MENU_STATE);

  const selectionMenuRef = useRef<HTMLDivElement | null>(null);
  const canvasMenuRef = useRef<HTMLDivElement | null>(null);

  const viewport = useViewportHelpers(canvasRef);
  const { invalidate } = useCanvasRenderer();

  const scale = useScale();
  const shapes = useShapes();
  const selectedShapeIds = useSelectedShapesIds();
  const setSelectedShapeIds = useSetSelectedShapesIds();

  function getMenuPosition(
    event: MouseEvent<HTMLCanvasElement>,
    menu: HTMLDivElement,
  ) {
    const rect = menu.getBoundingClientRect();

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    let adjustedX = event.clientX;
    let adjustedY = event.clientY;

    // Check if menu goes off right edge
    if (event.clientX + rect.width > windowWidth - WINDOW_PADDING) {
      adjustedX = Math.max(
        WINDOW_PADDING,
        windowWidth - rect.width - WINDOW_PADDING,
      );
    }

    // Check if menu goes off bottom edge
    if (event.clientY + rect.height > windowHeight - WINDOW_PADDING) {
      adjustedY = Math.max(
        WINDOW_PADDING,
        windowHeight - rect.height - WINDOW_PADDING,
      );
    }

    return { x: adjustedX, y: adjustedY };
  }

  function getMenuTarget(clientX: number, clientY: number): MenuTarget {
    const point = viewport.clientToCanvas(clientX, clientY);
    if (!point) {
      return "canvas";
    }

    // When there are selected shapes
    if (selectedShapeIds.length > 0) {
      const selected = new Set(selectedShapeIds);

      const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
      const bounds = getGroupBounds(selectedShapes);

      return isPointInSelectedShapeBounds(point, bounds)
        ? "selection"
        : "canvas";
    }

    // When there's no selected shape
    const hitShape = getShapeAtPosition({
      point,
      shapes,
      scale,
    });

    if (!hitShape) {
      return "canvas";
    }

    setSelectedShapeIds([hitShape.id]);
    invalidate();

    return "selection";
  }

  function openContextMenu(event: MouseEvent<HTMLCanvasElement>) {
    event.preventDefault();

    if (!selectionMenuRef.current || !canvasMenuRef.current) {
      return;
    }
    const target = getMenuTarget(event.clientX, event.clientY);

    const position =
      target === "selection"
        ? getMenuPosition(event, selectionMenuRef.current)
        : getMenuPosition(event, canvasMenuRef.current);

    setMenu({
      open: true,
      target,
      ...position,
    });
  }

  function closeContextMenu() {
    setMenu(DEFAULT_MENU_STATE);
  }

  // Handles Close Context Menu
  useEffect(() => {
    if (!menu.open) return;

    const handleCloseContextMenu = (e: PointerEvent) => {
      if (
        selectionMenuRef.current?.contains(e.target as Node) ||
        canvasMenuRef.current?.contains(e.target as Node)
      ) {
        return;
      }

      closeContextMenu();
    };

    document.addEventListener("pointerdown", handleCloseContextMenu);
    return () => {
      document.removeEventListener("pointerdown", handleCloseContextMenu);
    };
  }, [menu.open, closeContextMenu]);

  return {
    menu,

    selectionMenuRef,
    canvasMenuRef,

    openContextMenu,
    closeContextMenu,
  };
}
