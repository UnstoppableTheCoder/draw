import { useCanvasRenderer } from "../../context/use-renderer";
import {
  useAddImage,
  useImages,
  usePushHistory,
  useSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { ImageAsset, Shape } from "../../types";
import { writeClipboard, readClipboard } from "./clipboard-actions";
import { v4 as uuidv4 } from "uuid";

const PASTE_OFFSET = 20;

export default function useClipboard() {
  const selectedShapesIds = useSelectedShapesIds();
  const shapes = useShapes();
  const setShapes = useSetShapes();
  const images = useImages();
  const pushHistory = usePushHistory();
  const addImage = useAddImage();

  const { invalidate } = useCanvasRenderer();

  const copyShapes = async () => {
    if (selectedShapesIds.length === 0) return;

    const selectedIds = new Set(selectedShapesIds);

    const copiedShapes = shapes
      .filter((shape) => selectedIds.has(shape.id))
      .map((shape) => structuredClone(shape));

    if (copiedShapes.length === 0) return;

    const imageAssetIds = new Set<string>();

    for (const shape of copiedShapes) {
      if (shape.type === "image") {
        imageAssetIds.add(shape.data.imageId);
      }
    }

    const copiedImageAssets = Object.values(images)
      .filter((asset) => imageAssetIds.has(asset.id))
      .map((asset) => structuredClone(asset));

    await writeClipboard({
      shapes: copiedShapes,
      imageAssets: copiedImageAssets,
    });
  };

  const cutShapes = async () => {
    await copyShapes();

    const selectedIds = new Set(selectedShapesIds);

    setShapes((prev) => prev.filter((shape) => !selectedIds.has(shape.id)));

    pushHistory();
    invalidate();
  };

  const pasteShapes = async () => {
    const clipboard = await readClipboard();
    if (!clipboard) return;

    // Image Asset
    const imageAssetIdMap = new Map<string, string>();
    const groupIdMap = new Map<string, string>();
    const shapeIdMap = new Map<string, string>();

    for (const shape of clipboard.shapes) {
      shapeIdMap.set(shape.id, uuidv4());
    }

    // Duplicate image assets
    const newImageAssets = clipboard.imageAssets.map((asset: ImageAsset) => {
      const newId = uuidv4();
      imageAssetIdMap.set(asset.id, newId);

      return {
        ...structuredClone(asset),
        id: newId,
      };
    });

    // Duplicate shapes
    const newShapes = clipboard.shapes.map((shape: Shape) => {
      const cloned: Shape = structuredClone(shape);

      cloned.id = shapeIdMap.get(shape.id)!;

      cloned.x += PASTE_OFFSET;
      cloned.y += PASTE_OFFSET;

      if (cloned.type === "image") {
        const newImageAssetId = imageAssetIdMap.get(cloned.data.imageId);

        if (newImageAssetId) {
          cloned.data.imageId = newImageAssetId;
        }
      }

      cloned.groupId = cloned.groupId
        ? getDuplicatedGroupId(cloned.groupId, groupIdMap)
        : null;

      cloned.frameId = cloned.frameId
        ? (shapeIdMap.get(cloned.frameId) ?? null)
        : null;

      return cloned;
    });

    // Merge image assets into store
    if (newImageAssets.length) {
      newImageAssets.forEach((image: ImageAsset) => {
        addImage(image);
      });
    }

    // Add shapes
    setShapes((prev) => [...prev, ...newShapes]);

    pushHistory();
    invalidate();
  };

  const getDuplicatedGroupId = (
    originalGroupId: string,
    groupIdMap: Map<string, string>,
  ) => {
    let duplicatedId = groupIdMap.get(originalGroupId);

    if (!duplicatedId) {
      duplicatedId = uuidv4();
      groupIdMap.set(originalGroupId, duplicatedId);
    }

    return duplicatedId;
  };

  return {
    copyShapes,
    cutShapes,
    pasteShapes,
  };
}
