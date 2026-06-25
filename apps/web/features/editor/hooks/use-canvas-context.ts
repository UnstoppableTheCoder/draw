import { RefObject, useEffect, useRef } from "react";

export default function useCanvasContext(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Handles Context Creation
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");
    if (!canvasContext) return;

    ctxRef.current = canvasContext;
  }, [canvasRef]);

  return { ctxRef };
}
