import { useEffect } from "react";
import useShapeDelete from "../actions/use-delete-shapes";

export default function useEditorShortcuts() {
  const { deleteShapes } = useShapeDelete();

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
