import { RefObject, useEffect } from "react";
import { useCanvasRenderer } from "../../renderer/use-renderer";

export default function useCanvasResize(
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>,
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const { invalidate } = useCanvasRenderer();

  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      [sceneCanvasRef, overlayCanvasRef].forEach((ref) => {
        if (!ref.current) return;

        ref.current.width = width;
        ref.current.height = height;
      });

      invalidate();
    }

    resize();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [sceneCanvasRef, overlayCanvasRef, invalidate]);
}
