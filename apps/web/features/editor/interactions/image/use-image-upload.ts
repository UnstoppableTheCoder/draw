import { ChangeEvent, RefObject, useEffect } from "react";
import * as store from "../../store/editor/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import { IMAGE_GAP, MAX_IMAGE_SIZE } from "../../constants/image";
import { createImageShape } from "./create-image-shape";
import { usePointerState } from "../../pointer/use-pointer-state";
import { loadImageAssets } from "./image-loader";
import { getNextZIndex } from "../../utils/z-index";
import { createImageAssets } from "../../networking/api/image-asset-api";
import { useParams } from "next/navigation";
import { useUser } from "@/features/auth/store/selectors";
import { createShapes } from "../../networking/api/shape-api";
import { useImageManager } from "../manager/image-manager";
import { useAddImage } from "../../store/board/pages/selectors";

export default function useImageUpload({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
  imageInputRef,
  imageManager,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  imageInputRef: RefObject<HTMLInputElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
  imageManager: ReturnType<typeof useImageManager>;
}) {
  const selectedTool = store.useSelectedTool();
  const setSelectedTool = store.useSetSelectedTool();
  const setShapes = store.useSetShapes();
  const setSelectedShapesIds = store.useSetSelectedShapesIds();
  const shapes = store.useShapes();
  const addImage = useAddImage();
  const { pageId } = useParams<{ boardId: string; pageId: string }>();
  const user = useUser();

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

    const { assets, upload } = await loadImageAssets(files, pageId, user!.id);

    // Cache uploaded assets
    assets.forEach(addImage);

    const { rows, cols } = getGridSize(assets.length);
    const CELL_SIZE = MAX_IMAGE_SIZE + IMAGE_GAP;

    const canvasCoords = clientToCanvas(canvas.width / 2, canvas.height / 2);

    if (!canvasCoords) return;

    const { x: centerX, y: centerY } = canvasCoords;

    const gridWidth = cols * CELL_SIZE - IMAGE_GAP;
    const gridHeight = rows * CELL_SIZE - IMAGE_GAP;

    const startX = centerX - gridWidth / 2;
    const startY = centerY - gridHeight / 2;

    const imageShapes = assets.map((image, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const lastShapeZIndex = shapes.at(-1)?.zIndex!;
      const zIndex = getNextZIndex(lastShapeZIndex);
      const shape = createImageShape({
        image,
        zIndex,
        pageId,
        createdById: user!.id,
      });

      shape.x = startX + col * CELL_SIZE + (MAX_IMAGE_SIZE - shape.width) / 2;
      shape.y = startY + row * CELL_SIZE + (MAX_IMAGE_SIZE - shape.height) / 2;

      return shape;
    });

    const imageMap = Object.fromEntries(
      assets.map((image) => [image.id, image]),
    );
    await imageManager.preload(imageMap);

    setShapes((prev) => [...prev, ...imageShapes]);
    setSelectedTool("select");

    setSelectedShapesIds(imageShapes.map((shape) => shape.id));

    pointerRefs.interactionRef.current = {
      type: "select",
      previewShapes: imageShapes,
      selectedShapesIds: new Set(imageShapes.map((shape) => shape.id)),
    };

    invalidate();

    // Allow selecting the same file again
    e.target.value = "";

    // Save Image Shape
    await createShapes(pageId, imageShapes);
    upload.then(async (imageAssets) => {
      await createImageAssets(pageId, imageAssets);
    });
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
