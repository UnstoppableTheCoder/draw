import { ChangeEvent, RefObject, useEffect } from "react";
import * as store from "../../store/editor/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import { IMAGE_GAP, MAX_IMAGE_SIZE } from "../../constants/image";
import { createImageShape } from "./create-image-shape";
import { usePointerState } from "../../pointer/use-pointer-state";
import { loadImageAssets } from "./image-loader";

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
  const setSelectedShapesIds = store.useSetSelectedShapesIds();
  const addImage = store.useAddImage();

  const { invalidate } = useCanvasRenderer();
  const { clientToCanvas } = useViewportHelpers(sceneCanvasRef);

  const getGridSize = (count: number) => {
    // Formula to calculate no of rows and columns to make a grid as square as possible
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    return { rows, cols };
  };

  const handleImageInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const canvas = sceneCanvasRef.current;
    if (!canvas) return;

    const { assets, upload } = await loadImageAssets(files);

    // Cache uploaded assets
    assets.forEach(addImage);

    upload.then((res) => {
      // invalidate();
      console.log("Uploaded");
      console.log(res);
    });

    const { rows, cols } = getGridSize(assets.length);
    const CELL_SIZE = MAX_IMAGE_SIZE + IMAGE_GAP;

    const canvasCoords = clientToCanvas(canvas.width / 2, canvas.height / 2);

    if (!canvasCoords) return;

    const { x: centerX, y: centerY } = canvasCoords;

    const gridWidth = cols * CELL_SIZE - IMAGE_GAP;
    const gridHeight = rows * CELL_SIZE - IMAGE_GAP;

    const startX = centerX - gridWidth / 2;
    const startY = centerY - gridHeight / 2;

    const shapes = assets.map((image, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const shape = createImageShape(image);
      shape.x = startX + col * CELL_SIZE + (MAX_IMAGE_SIZE - shape.width) / 2;
      shape.y = startY + row * CELL_SIZE + (MAX_IMAGE_SIZE - shape.height) / 2;

      return shape;
    });

    setShapes((prev) => [...prev, ...shapes]);
    setSelectedTool("select");

    setSelectedShapesIds(shapes.map((shape) => shape.id));

    pointerRefs.interactionRef.current = {
      type: "select",
      previewShapes: shapes,
      selectedShapesIds: new Set(shapes.map((shape) => shape.id)),
    };

    invalidate();

    // Allow selecting the same file again
    e.target.value = "";
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
