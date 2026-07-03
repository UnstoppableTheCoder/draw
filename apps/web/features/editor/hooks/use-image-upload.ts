import { ChangeEvent, RefObject, useEffect } from "react";
import * as store from "../store/editor/selectors";
import { usePointerState } from "./pointer/use-pointer-state";
import { useCanvasRenderer } from "../context/use-renderer";
import useViewportHelpers from "./viewport/use-viewport-helpers";
import { loadImageInfos } from "../image/image-loader";
import { IMAGE_GAP, MAX_IMAGE_SIZE } from "../constants/image";
import { createImageShape } from "../shapes/create-image-shape";
import { getGroupBounds } from "./interactions/use-selection-actions";

export default function useImageUpload({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
  imageInputRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  imageInputRef: RefObject<HTMLInputElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
}) {
  const selectedTool = store.useSelectedTool();
  const setSelectedTool = store.useSetSelectedTool();
  const setShapes = store.useSetShapes();
  const setSelectedShapeIds = store.useSetSelectedShapeIds();

  const { invalidate } = useCanvasRenderer();
  const { clientToCanvas } = useViewportHelpers(sceneCanvasRef);

  const getGridSize = (count: number) => {
    // Formula to calculate no of rows and columns to make a grid as square as possible
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    return { rows, cols };
  };

  const handleImageInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // overlayCanvasRef.current?.focus();

    const files = e.target.files;
    if (!files?.length) return;

    const canvas = sceneCanvasRef.current;
    if (!canvas) return;

    // Returns - imageUrl, width and height
    const imageInfos = await loadImageInfos(files);

    // Grid
    const { rows, cols } = getGridSize(imageInfos.length);
    const CELL_SIZE = MAX_IMAGE_SIZE + IMAGE_GAP;

    const canvasCoords = clientToCanvas(canvas.width / 2, canvas.height / 2);
    if (!canvasCoords) return;
    const { x: centerX, y: centerY } = canvasCoords;

    // Formula
    const gridWidth = cols * CELL_SIZE - IMAGE_GAP;
    const gridHeight = rows * CELL_SIZE - IMAGE_GAP;

    // Start Point of grid to center it on canvas
    const startX = centerX - gridWidth / 2;
    const startY = centerY - gridHeight / 2;

    const shapes = imageInfos.map((image, index) => {
      // Calculate the row and column for the current image based on its index
      const row = Math.floor(index / cols);
      const col = index % cols;

      // Calculates the (x, y) for the image
      const x = startX + col * CELL_SIZE + (MAX_IMAGE_SIZE - image.width) / 2;
      const y = startY + row * CELL_SIZE + (MAX_IMAGE_SIZE - image.height) / 2;

      return createImageShape({
        image,
        x,
        y,
      });
    });

    if (!shapes) return;
    setShapes((prev) => [...prev, ...shapes]);
    setSelectedTool("select");

    pointerRefs.interactionRef.current = {
      type: "select",
      previewShapes: shapes,
      groupBounds: getGroupBounds(shapes),
    };
    setSelectedShapeIds(shapes.map((shape) => shape.id));

    invalidate();
  };

  // Clicks image input if tool is image
  useEffect(() => {
    if (selectedTool === "image") {
      imageInputRef.current?.click();
    }
  }, [selectedTool]);

  return {
    handleImageInputChange,
  };
}
