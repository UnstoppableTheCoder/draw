import { useEffect } from "react";
import {
  useSelectedShapesIds,
  useSetSelectedShapesIds,
  useSetShapes,
} from "../../store/editor/selectors";
import { useEditorStore } from "../../store/editor/editor-store";
import { useCanvasRenderer } from "../../context/use-renderer";

export default function useEditorShortcuts() {
  const setSelectedShapesIds = useSetSelectedShapesIds();
  const setShapes = useSetShapes();

  const { invalidate } = useCanvasRenderer();

  const deleteShapes = () => {
    const { selectedShapesIds } = useEditorStore.getState();
    const selected = new Set(selectedShapesIds);

    if (selectedShapesIds.length === 0) return;

    setShapes((prevShapes) =>
      prevShapes.filter((shape) => !selected.has(shape.id)),
    );
    setSelectedShapesIds([]);
    invalidate();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        deleteShapes();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
