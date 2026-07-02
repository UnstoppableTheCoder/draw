import { useCallback, useEffect } from "react";
import { usePointerState } from "../pointer/use-pointer-state";
import { useSetPanOffset } from "../../store/editor/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";

export default function usePan(
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const setPanOffset = useSetPanOffset();
  const { invalidate } = useCanvasRenderer();

  const handlePanMove = useCallback(
    (clientX: number, clientY: number) => {
      const startMouse = pointerRefs.panStartMouseRef.current;
      const startOffset = pointerRefs.panStartOffsetRef.current;

      if (!startMouse || !startOffset) return;

      setPanOffset({
        x: startOffset.x + clientX - startMouse.x,
        y: startOffset.y + clientY - startMouse.y,
      });

      invalidate();
    },
    [pointerRefs, setPanOffset, invalidate],
  );

  // Moves the page up and down and left and right
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;

      setPanOffset((prev) => ({
        x: prev.x - (e.shiftKey ? e.deltaY : e.deltaX),
        y: prev.y - (e.shiftKey ? e.deltaX : e.deltaY),
      }));

      invalidate();
    };

    window.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [setPanOffset, invalidate]);

  return {
    handlePanMove,
  };
}
