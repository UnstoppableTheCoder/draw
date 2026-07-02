import { useCallback } from "react";
import {
  useSetSelectedShapeIds,
  useSetSelectedTool,
} from "../../store/editor/selectors";
import { ToolType } from "@/types/toolbar.types";
import { useCanvasRenderer } from "../../context/use-renderer";

export default function useToolActions() {
  const setSelectedTool = useSetSelectedTool();
  const setSelectedShapeIds = useSetSelectedShapeIds();

  const { invalidateOverlay } = useCanvasRenderer();

  const selectTool = useCallback(
    (tool: ToolType) => {
      setSelectedShapeIds([]);
      setSelectedTool(tool);

      invalidateOverlay();
    },
    [setSelectedShapeIds, setSelectedTool, invalidateOverlay],
  );

  return { selectTool };
}
