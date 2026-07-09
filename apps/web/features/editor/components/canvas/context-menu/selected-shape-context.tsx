import MenuButton from "./menu-button";
import { ContextMenuType } from "../../types";
import { Separator } from "../../ui/separator";
import useDeleteShapes from "@/features/editor/hooks/actions/use-delete-shapes";
import useDuplicateShapes from "@/features/editor/hooks/actions/use-duplicate-shapes";
import useShapeOrder from "@/features/editor/hooks/order/use-shape-order";
import {
  useSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "@/features/editor/store/editor/selectors";
import { v4 as uuidv4 } from "uuid";
import { useCanvasRenderer } from "@/features/editor/context/use-renderer";
import { getGroupBounds } from "@/features/editor/geometry/bounding-box/get-group-bounds";
import { normalizeRect } from "@/features/editor/geometry/normalize-rect";
import { RefObject } from "react";
import getTextDimensions from "@/features/editor/utils/get-text-dimensions";
import { FrameShape } from "@/features/editor/types/types";
import { TOLERANCE } from "@/features/editor/constants/canvas";
import { usePointerState } from "@/features/editor/hooks/pointer/use-pointer-state";

export default function selectedShapeContext({
  contextMenu: {
    menu: { open, x, y, clickedInSelectedArea },
    closeContextMenu,
    selectedShapeContextRef,
    overlayCanvasRef,
  },
  pointerRefs,
}: {
  contextMenu: ContextMenuType & {
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  };
  pointerRefs: ReturnType<typeof usePointerState>;
}) {
  const setShapes = useSetShapes();
  const shapes = useShapes();
  const selectedShapesIds = useSelectedShapesIds();

  const selected = new Set(selectedShapesIds);
  const { invalidate } = useCanvasRenderer();

  const { deleteShapes } = useDeleteShapes(pointerRefs);
  const { duplicateShapes } = useDuplicateShapes();
  const order = useShapeOrder();

  const handleDuplicateClick = () => {
    duplicateShapes();
    closeContextMenu();
  };

  const handleDeleteClick = () => {
    deleteShapes();
    closeContextMenu();
  };

  const handleSendBackwardClick = () => {
    order.sendBackward();
    closeContextMenu();
  };

  const handleBringForwardClick = () => {
    order.bringForward();
    closeContextMenu();
  };

  const handleSendToBackClick = () => {
    order.sendToBack();
    closeContextMenu();
  };

  const handleBringToFrontClick = () => {
    order.bringToFront();
    closeContextMenu();
  };

  const handleGroupSelection = () => {
    const groupId = uuidv4();

    setShapes((prevShapes) =>
      prevShapes.map((prevShape) =>
        selected.has(prevShape.id) ? { ...prevShape, groupId } : prevShape,
      ),
    );

    invalidate();
  };

  // Complete this
  const handleUngroupSelection = () => {};

  const handleWrapSelectionInFrame = () => {
    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) return;
    const scaledTolerance = 5 * TOLERANCE;

    const selected = new Set(selectedShapesIds);

    const selectedShapes = shapes.filter((shape) => selected.has(shape.id));
    const bounds = getGroupBounds(selectedShapes);

    if (!bounds) return;

    const frameId = uuidv4();

    const rect = normalizeRect(
      { x: bounds.minX - scaledTolerance, y: bounds.minY - scaledTolerance },
      { x: bounds.maxX + scaledTolerance, y: bounds.maxY + scaledTolerance },
    );

    const frameName = {
      name: "Frame Name",
      fontSize: 14,
      fontFamily: "Virgil",
    };

    const frame: FrameShape = {
      id: frameId,
      type: "frame",
      ...rect,
      strokeWidth: 2,
      text: {
        ...frameName,
        ...getTextDimensions({
          ctx,
          text: frameName.name,
          fontSize: frameName.fontSize,
          fontFamily: frameName.fontFamily,
        }),
      },
    };

    setShapes((prevShapes) => {
      const selectedShapes = prevShapes
        .filter((shape) => selected.has(shape.id))
        .map((shape) => (shape.frameId ? shape : { ...shape, frameId }));

      const otherShapes = prevShapes.filter((shape) => !selected.has(shape.id));

      return [...otherShapes, frame, ...selectedShapes];
    });

    invalidate();
  };

  const handleRemoveAllElementFromFrame = () => {};

  const handleRemoveFrame = () => {};

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

      <MenuButton onClick={handleGroupSelection}>Group selection</MenuButton>
      <MenuButton onClick={handleUngroupSelection}>
        Ungroup selection
      </MenuButton>

      <MenuButton onClick={handleWrapSelectionInFrame}>
        Wrap selection in frame
      </MenuButton>
      <MenuButton onClick={handleRemoveAllElementFromFrame}>
        Remove all elements from frame
      </MenuButton>
      <MenuButton onClick={handleRemoveFrame}>Remove frame</MenuButton>

      <Separator />

      <MenuButton shortcut="Shift+Alt+C">Copy to clipboard as PNG</MenuButton>
      <MenuButton>Copy to clipboard as SVG</MenuButton>

      <Separator />

      <MenuButton shortcut="Ctrl+Alt+C">Copy Styles</MenuButton>
      <MenuButton shortcut="Ctrl+Alt+V">Paste Styles</MenuButton>

      <Separator />

      <MenuButton>Add to library</MenuButton>

      <Separator />

      <MenuButton shortcut="Ctrl+[" onClick={handleSendBackwardClick}>
        Send backward
      </MenuButton>
      <MenuButton shortcut="Ctrl+]" onClick={handleBringForwardClick}>
        Bring forward
      </MenuButton>
      <MenuButton shortcut="Ctrl+Shift+[" onClick={handleSendToBackClick}>
        Send to back
      </MenuButton>
      <MenuButton shortcut="Ctrl+Shift+]" onClick={handleBringToFrontClick}>
        Bring to front
      </MenuButton>

      <Separator />

      <MenuButton shortcut="Shift+H">Flip horizontal</MenuButton>
      <MenuButton shortcut="Shift+V">Flip vertical</MenuButton>

      <Separator />

      <MenuButton shortcut="Ctrl+K">Add link</MenuButton>
      <MenuButton>Copy link to object</MenuButton>

      <Separator />
      <MenuButton shortcut="Ctrl+D" onClick={handleDuplicateClick}>
        Duplicate
      </MenuButton>
      <MenuButton shortcut="Ctrl+Shift+L">Lock</MenuButton>

      <Separator />

      <MenuButton destructive shortcut="⌫ | Delete" onClick={handleDeleteClick}>
        Delete
      </MenuButton>
    </div>
  );
}
