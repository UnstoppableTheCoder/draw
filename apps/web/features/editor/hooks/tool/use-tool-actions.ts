import { useCallback } from "react";
import { useCanvasRenderer } from "../../renderer/use-renderer";
import { useSetSelectedShape, useSetSelectedTool } from "../../store/selectors";
import { ToolType } from "@/types/toolbar.types";

export default function useToolActions() {
  const setSelectedTool = useSetSelectedTool();
  const setSelectedShape = useSetSelectedShape();

  const { invalidateOverlay } = useCanvasRenderer();

  const selectTool = useCallback(
    (tool: ToolType) => {
      setSelectedShape(null);
      setSelectedTool(tool);

      invalidateOverlay();
    },
    [setSelectedShape, setSelectedTool, invalidateOverlay],
  );

  return { selectTool };
}
