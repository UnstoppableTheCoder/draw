import { useEffect } from "react";
import useDeleteShapes from "../selection/use-delete-shapes";
import { usePointerState } from "../../pointer/use-pointer-state";

export default function useEditorShortcuts(
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const { deleteShapes } = useDeleteShapes(pointerRefs);

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
