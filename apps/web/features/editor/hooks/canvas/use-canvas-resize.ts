import { RefObject, useEffect } from "react";

export default function useCanvasResize(
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>,
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      [sceneCanvasRef, overlayCanvasRef].forEach((ref) => {
        if (!ref.current) return;

        ref.current.width = width;
        ref.current.height = height;
      });
    }

    resize();

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);
}
