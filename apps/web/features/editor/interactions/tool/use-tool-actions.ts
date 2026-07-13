import { useCallback } from "react";
import {
  useSetSelectedShapesIds,
  useSetSelectedTool,
} from "../../store/editor/selectors";
import { ToolType } from "@/features/editor/types/toolbar";
import { useCanvasRenderer } from "../../context/use-renderer";

export default function useToolActions() {
  const setSelectedTool = useSetSelectedTool();
  const setSelectedShapesIds = useSetSelectedShapesIds();

  const { invalidateOverlay } = useCanvasRenderer();

  const selectTool = useCallback(
    (tool: ToolType) => {
      setSelectedShapesIds([]);
      setSelectedTool(tool);

      invalidateOverlay();
    },
    [setSelectedShapesIds, setSelectedTool, invalidateOverlay],
  );

  return { selectTool };
}
