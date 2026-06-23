import { ChangeEvent, RefObject, useEffect } from "react";
import { IMAGE_GAP, MAX_IMAGE_SIZE } from "../constants/image";
import { loadImageInfos } from "../utils/image-loader";
import { createImageShape } from "../shapes/create-image-shape";
import { getScreenToCanvasCoordinates } from "../utils/get-coordinates";
import {
  useShapesState,
  useToolState,
  useViewportState,
} from "../store/selectors";
export default function useImageUpload(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  imageInputRef: RefObject<HTMLInputElement | null>,
) {
  const { panOffset, scale, scaleOffset } = useViewportState();
  const { setShapes } = useShapesState();
  const { selectedTool, setSelectedTool } = useToolState();

  const getGridSize = (count: number) => {
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    return { rows, cols };
  };

  const handleImageInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageInfos = await loadImageInfos(files);

    const { rows, cols } = getGridSize(imageInfos.length);

    const CELL_SIZE = MAX_IMAGE_SIZE + IMAGE_GAP;

    const { x: centerX, y: centerY } = getScreenToCanvasCoordinates({
      screenX: canvas.width / 2,
      screenY: canvas.height / 2,
      canvas,
      panOffset,
      scale,
      scaleOffset,
    });

    // Formula
    const gridWidth = cols * CELL_SIZE - IMAGE_GAP;
    const gridHeight = rows * CELL_SIZE - IMAGE_GAP;

    const startX = centerX - gridWidth / 2;
    const startY = centerY - gridHeight / 2;

    const shapes = imageInfos.map((image, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const x = startX + col * CELL_SIZE + (MAX_IMAGE_SIZE - image.width) / 2;
      const y = startY + row * CELL_SIZE + (MAX_IMAGE_SIZE - image.height) / 2;

      return createImageShape({
        image,
        x,
        y,
      });
    });

    setShapes((prev) => [...prev, ...shapes]);
    setSelectedTool("select");

    e.target.value = "";
  };

  // Clicks image input if tool is image
  useEffect(() => {
    if (selectedTool === "image" && imageInputRef.current) {
      imageInputRef.current.click();
    }
  }, [selectedTool]);

  return {
    handleImageInputChange,
  };
}
