import { MouseEvent, RefObject, useRef, useState } from "react";
import { getShapeAtPosition } from "../../geometry/hit-test/get-shape-at-position";
import {
  useScale,
  useSelectedShapesIds,
  useSetSelectedShapesIds,
  useShapes,
} from "../../store/editor/selectors";
import { getGroupBounds } from "../interactions/use-selection-actions";
import { isPointInSelectedShapeBounds } from "../../geometry/hit-test/is-point-in-selected-bounds";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import { useCanvasRenderer } from "../../context/use-renderer";

type Menu = {
  open: boolean;
  x: number;
  y: number;
  clickedInSelectedArea: boolean;
};

export default function useCanvasContextMenu(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const selectedShapeContextRef = useRef<HTMLDivElement | null>(null);
  const canvasContextRef = useRef<HTMLDivElement | null>(null);

  const viewport = useViewportHelpers(canvasRef);
  const { invalidate } = useCanvasRenderer();
  const scale = useScale();

  const shapes = useShapes();
  let selectedShapesIds = useSelectedShapesIds();
  const setSelectedShapesIds = useSetSelectedShapesIds();

  const [menu, setMenu] = useState<Menu>({
    open: false,
    x: 0,
    y: 0,
    clickedInSelectedArea: false,
  });

  const getContextMenuPos = (
    e: MouseEvent<HTMLCanvasElement>,
    contextMenu: HTMLDivElement,
  ) => {
    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x = e.clientX;
    let y = e.clientY;

    // Prevent overflow on the right
    if (x + menuWidth > windowWidth) {
      x = windowWidth - menuWidth - 8;
    }

    // Prevent overflow on the bottom
    if (y + menuHeight > windowHeight) {
      y = windowHeight - menuHeight - 8;
    }

    // Prevent negative positions
    x = Math.max(8, x);
    y = Math.max(8, y);

    return { x, y };
  };

  const openContextMenu = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    if (!selectedShapeContextRef.current || !canvasContextRef.current) return;

    const point = viewport.clientToCanvas(e.clientX, e.clientY);
    if (!point) return;

    let clickedInSelectedArea: boolean;
    if (selectedShapesIds.length > 0) {
      const selected = new Set(selectedShapesIds);

      const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
      const groupBounds = getGroupBounds(selectedShapes);

      clickedInSelectedArea = isPointInSelectedShapeBounds(point, groupBounds);
    } else {
      const hitShape = getShapeAtPosition({ point, shapes, scale });

      if (hitShape) {
        clickedInSelectedArea = true;
        setSelectedShapesIds([hitShape.id]);
        invalidate();
      }
    }

    const selectedShapeContextPos = getContextMenuPos(
      e,
      selectedShapeContextRef.current,
    );
    const canvasContextPos = getContextMenuPos(e, canvasContextRef.current);

    if (clickedInSelectedArea!) {
      setMenu((prev) => ({
        ...prev,
        x: selectedShapeContextPos.x,
        y: selectedShapeContextPos.y,
        open: true,
        clickedInSelectedArea,
      }));
    } else {
      setMenu((prev) => ({
        ...prev,
        x: canvasContextPos.x,
        y: canvasContextPos.y,
        open: true,
        clickedInSelectedArea,
      }));
    }
  };

  const closeContextMenu = () => {
    setMenu({ open: false, x: 0, y: 0, clickedInSelectedArea: false });
  };

  const updateContextMenu = (clickedInSelectedArea: boolean) => {
    setMenu((prev) => ({ ...prev, clickedInSelectedArea }));
  };

  return {
    selectedShapeContextRef,
    canvasContextRef,
    menu,
    openContextMenu,
    closeContextMenu,
    updateContextMenu,
  };
}
