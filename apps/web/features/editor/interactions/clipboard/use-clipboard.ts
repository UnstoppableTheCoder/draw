import { useCanvasRenderer } from "../../context/use-renderer";
import { ImageAsset, Shape } from "../../types";
import { writeClipboard, readClipboard } from "./clipboard-actions";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { createShapes, deleteShapesApi } from "../../networking/api/shape-api";
import { useImageManager } from "../manager/image-manager";
import { createImageAssets } from "../../networking/api/image-asset-api";
import {
  usePushHistory,
  useSelectedShapesIds,
  useSetSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { useAddImage, useImages } from "../../store/board/pages/selectors";

const PASTE_OFFSET = 20;
type ImageManager = ReturnType<typeof useImageManager>;

// Helpers
/** Returns (or creates) the duplicated group id for a given original id. */
const getDuplicatedGroupId = (
  originalGroupId: string,
  groupIdMap: Map<string, string>,
): string => {
  let duplicatedId = groupIdMap.get(originalGroupId);
  if (!duplicatedId) {
    duplicatedId = uuidv4();
    groupIdMap.set(originalGroupId, duplicatedId);
  }
  return duplicatedId;
};

/** Collect all image asset ids referenced by the given shapes. */
const collectImageAssetIds = (shapes: Shape[]): Set<string> => {
  const ids = new Set<string>();
  for (const shape of shapes) {
    if (shape.type === "image") ids.add(shape.data.imageId);
  }
  return ids;
};

/** Build a map of original id -> new uuid for the given shapes. */
const buildShapeIdMap = (shapes: Shape[]): Map<string, string> => {
  const map = new Map<string, string>();
  for (const shape of shapes) map.set(shape.id, uuidv4());
  return map;
};

/** Clone image assets with new ids and return both the list and id map. */
const duplicateImageAssets = (assets: ImageAsset[]) => {
  const imageAssetIdMap = new Map<string, string>();

  const clonedImageAssets = assets.map((asset) => {
    const newId = uuidv4();
    imageAssetIdMap.set(asset.id, newId);

    return { ...structuredClone(asset), id: newId };
  });

  return { clonedImageAssets, imageAssetIdMap };
};

/** Clone shapes, remap ids, offset positions, and rewire references. */
const duplicateShapes = (
  shapes: Shape[],
  shapeIdMap: Map<string, string>,
  imageAssetIdMap: Map<string, string>,
  remapImageAssets: boolean,
): Shape[] => {
  const groupIdMap = new Map<string, string>();

  return shapes.map((shape) => {
    const cloned: Shape = structuredClone(shape);

    cloned.id = shapeIdMap.get(shape.id)!;
    cloned.x += PASTE_OFFSET;
    cloned.y += PASTE_OFFSET;

    if (remapImageAssets && cloned.type === "image") {
      const newImageAssetId = imageAssetIdMap.get(cloned.data.imageId);
      if (newImageAssetId) cloned.data.imageId = newImageAssetId;
    }

    cloned.groupId = cloned.groupId
      ? getDuplicatedGroupId(cloned.groupId, groupIdMap)
      : null;

    cloned.frameId = cloned.frameId
      ? (shapeIdMap.get(cloned.frameId) ?? null)
      : null;

    return cloned;
  });
};

// Hook
export default function useClipboard(imageManager: ImageManager) {
  const { pageId } = useParams<{ boardId: string; pageId: string }>();

  const selectedShapesIds = useSelectedShapesIds();
  const setSelectedShapesIds = useSetSelectedShapesIds();
  const shapes = useShapes();
  const setShapes = useSetShapes();
  const images = useImages();
  const pushHistory = usePushHistory();
  const addImage = useAddImage();

  const { invalidate } = useCanvasRenderer();

  // Copy
  const copyShapes = async () => {
    if (selectedShapesIds.length === 0) return;

    const selectedIds = new Set(selectedShapesIds);
    const copiedShapes = shapes
      .filter((s) => selectedIds.has(s.id))
      .map((s) => structuredClone(s));

    if (copiedShapes.length === 0) return;

    const assetIds = collectImageAssetIds(copiedShapes);
    const copiedImageAssets = Object.values(images)
      .filter((asset) => assetIds.has(asset.id))
      .map((asset) => structuredClone(asset));

    await writeClipboard({
      shapes: copiedShapes,
      imageAssets: copiedImageAssets,
    });
  };

  // Cut
  const cutShapes = async () => {
    if (selectedShapesIds.length === 0) return;

    await copyShapes();

    const selectedIds = new Set(selectedShapesIds);
    setShapes((prev) => prev.filter((s) => !selectedIds.has(s.id)));

    pushHistory();
    invalidate();

    if (!pageId) return;

    try {
      await deleteShapesApi(pageId, Array.from(selectedIds));
    } catch (error) {
      console.error("Failed to sync cut shapes to DB:", error);
    }
  };

  // Paste
  const pasteShapes = async () => {
    const clipboard = await readClipboard();
    if (!clipboard || clipboard.shapes.length === 0) return;

    const isPastedOnSamePage = clipboard.imageAssets[0]?.pageId === pageId;

    // Build shape id maps
    const shapeIdMap = buildShapeIdMap(clipboard.shapes);

    // Duplicate image assets only when pasting on a different page
    const { clonedImageAssets: newImageAssets, imageAssetIdMap } =
      !isPastedOnSamePage
        ? duplicateImageAssets(clipboard.imageAssets)
        : {
            clonedImageAssets: [] as ImageAsset[],
            imageAssetIdMap: new Map<string, string>(),
          };

    // Duplicate shapes
    const newShapes = duplicateShapes(
      clipboard.shapes,
      shapeIdMap,
      imageAssetIdMap,
      !isPastedOnSamePage,
    );

    // Preload + register new image assets in the store
    if (!isPastedOnSamePage && newImageAssets.length > 0) {
      const assetMap = Object.fromEntries(newImageAssets.map((a) => [a.id, a]));
      await imageManager.preload(assetMap);
      newImageAssets.forEach(addImage);
    }

    // Commit shapes
    setShapes((prev) => [...prev, ...newShapes]);
    setSelectedShapesIds(newShapes.map((s) => s.id));
    pushHistory();
    invalidate();

    // Sync with database
    if (!pageId) return;

    try {
      if (!isPastedOnSamePage && newImageAssets.length > 0) {
        await createImageAssets(pageId, newImageAssets);
      }
      await createShapes(pageId, newShapes);
    } catch (error) {
      console.error("Failed to sync pasted shapes to DB:", error);
    }
  };

  return { copyShapes, cutShapes, pasteShapes };
}
