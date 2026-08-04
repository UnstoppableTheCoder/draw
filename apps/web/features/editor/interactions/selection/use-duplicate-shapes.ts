import { DUPLICATE_OFFSET } from "../../constants/actions";
import { useCanvasRenderer } from "../../context/use-renderer";
import { useEditorStore } from "../../store/editor/editor-store";
import {
  useSetSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { v4 as uuidv4 } from "uuid";
import { Shape } from "../../types";
import { getZIndexBetween } from "../../utils/shape-z-index";

export default function useDuplicateShapes() {
  const shapes = useShapes();
  const setShapes = useSetShapes();
  const setSelectedShapesIds = useSetSelectedShapesIds();
  const { invalidate } = useCanvasRenderer();

  const createDuplicatedShapes = (
    shapes: Shape[],
    selectedIds: Set<string>,
  ): Shape[] => {
    const groupIdMap = new Map<string, string>();

    let previousZIndex = shapes.at(-1)?.zIndex ?? null;

    return shapes
      .filter((shape) => selectedIds.has(shape.id))
      .map((shape) => {
        const zIndex = getZIndexBetween(previousZIndex, null);

        return {
          ...shape,
          id: uuidv4(),
          x: shape.x + DUPLICATE_OFFSET,
          y: shape.y + DUPLICATE_OFFSET,

          // Hierarchy
          groupId: shape.groupId
            ? getDuplicatedGroupId(shape.groupId, groupIdMap)
            : null,

          // Ordering
          zIndex,

          // Collaboration
          version: shape.version + 1,
          versionNonce: Math.floor(Math.random() * 2 ** 31),
          updated: Date.now(),
        };
      });
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

  const duplicateShapes = () => {
    const { selectedShapesIds } = useEditorStore.getState();

    if (selectedShapesIds.length === 0) return;

    const duplicatedShapes = createDuplicatedShapes(
      shapes,
      new Set(selectedShapesIds),
    );

    setShapes((prev) => [...prev, ...duplicatedShapes]);
    setSelectedShapesIds(duplicatedShapes.map((shape) => shape.id));
    invalidate();
  };

  return { duplicateShapes };
}
