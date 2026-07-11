import { useEffect } from "react";
import { useCanvasRenderer } from "../context/use-renderer";
import { EditorRefs } from "@/types";

export default function useCanvasResize({
  backgroundCanvasRef,
  sceneCanvasRef,
  overlayCanvasRef,
}: EditorRefs) {
  const { invalidate } = useCanvasRenderer();

  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      [backgroundCanvasRef, sceneCanvasRef, overlayCanvasRef].forEach((ref) => {
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
