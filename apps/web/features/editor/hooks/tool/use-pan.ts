import { RefObject, useEffect } from "react";
import * as store from "../../store/selectors";
import { usePointerState } from "../pointer/use-pointer-state";
import useCanvasRenderer from "../canvas/use-canvas-renderer";

export default function usePan({
  sceneCanvasRef,
  overlayCanvasRef,
  pointerRefs,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: ReturnType<typeof usePointerState>;
}) {
  const setPanOffset = store.useSetPanOffset();
  const renderer = useCanvasRenderer(pointerRefs);

  const handlePanMove = (clientX: number, clientY: number) => {
    const startMouse = pointerRefs.panStartMouseRef.current;
    const startOffset = pointerRefs.panStartOffsetRef.current;

    if (!startMouse || !startOffset) return;

    setPanOffset({
      x: startOffset.x + clientX - startMouse.x,
      y: startOffset.y + clientY - startMouse.y,
    });

    renderer.renderScene(sceneCanvasRef);
    renderer.renderOverlay(overlayCanvasRef);
  };

  // Moves the page up and down and left and right
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;

      setPanOffset((prev) => ({
        x: prev.x - (e.shiftKey ? e.deltaY : e.deltaX),
        y: prev.y - (e.shiftKey ? e.deltaX : e.deltaY),
      }));
    };

    window.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [setPanOffset]);

  return {
    handlePanMove,
  };
}
