import { DUPLICATE_OFFSET } from "../../constants/actions";
import { useCanvasRenderer } from "../../context/use-renderer";
import { useEditorStore } from "../../store/editor/editor-store";
import {
  usePushHistory,
  useSetSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { getZIndexBetween } from "../../utils/shape-z-index";
import { Shape } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { createShapes } from "../../networking/api/shape-api";

export default function useDuplicateShapes() {
  const { pageId } = useParams<{ pageId: string }>();

  const shapes = useShapes();
  const setShapes = useSetShapes();
  const setSelectedShapesIds = useSetSelectedShapesIds();
  const pushHistory = usePushHistory();

  const { invalidate } = useCanvasRenderer();

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

  const createDuplicatedShapes = (
    shapes: Shape[],
    selectedIds: Set<string>,
  ): Shape[] => {
    const groupIdMap = new Map<string, string>();
    const shapeIdMap = new Map<string, string>();

    let previousZIndex = shapes.at(-1)?.zIndex ?? null;

    shapes.forEach((shape) => {
      shapeIdMap.set(shape.id, uuidv4());
    });

    return shapes
      .filter((shape) => selectedIds.has(shape.id))
      .map((shape) => {
        const zIndex = getZIndexBetween(previousZIndex, null);
        previousZIndex = zIndex;

        return {
          ...shape,
          id: shapeIdMap.get(shape.id)!,

          x: shape.x + DUPLICATE_OFFSET,
          y: shape.y + DUPLICATE_OFFSET,

          groupId: shape.groupId
            ? getDuplicatedGroupId(shape.groupId, groupIdMap)
            : null,

          frameId: shape.frameId
            ? (shapeIdMap.get(shape.frameId) ?? null)
            : null,

          zIndex,

          version: shape.version + 1,
          versionNonce: Math.floor(Math.random() * 2 ** 31),
        };
      });
  };

  const duplicateShapes = async () => {
    const { selectedShapesIds } = useEditorStore.getState();

    if (selectedShapesIds.length === 0) return;

    const duplicatedShapes = createDuplicatedShapes(
      shapes,
      new Set(selectedShapesIds),
    );

    console.log({ duplicatedShapes });

    // Optimistic update
    setShapes((prev) => {
      const allShapes = [...prev, ...duplicatedShapes];

      console.log({ allShapes });
      return allShapes;
    });
    setSelectedShapesIds(duplicatedShapes.map((shape) => shape.id));
    pushHistory();
    invalidate();

    try {
      await createShapes(pageId, duplicatedShapes);
    } catch (error) {
      console.error("Error duplicating shapes:", error);

      // Rollback
      const duplicatedIds = new Set(duplicatedShapes.map((shape) => shape.id));
      setShapes((prev) => prev.filter((shape) => !duplicatedIds.has(shape.id)));
      setSelectedShapesIds([]);
      invalidate();
    }
  };

  return {
    duplicateShapes,
  };
}
