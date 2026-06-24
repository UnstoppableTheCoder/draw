"use client";

import { RefObject, useEffect } from "react";

export default function useCanvasResize(
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;

      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
