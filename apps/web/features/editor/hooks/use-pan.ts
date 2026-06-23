import { RefObject } from "react";
import { Point } from "../types/types";
import { useAppDispatch } from "@/hooks/hooks";
import { setPanOffset } from "@/features/viewport/viewport-slice";

export default function usePan(
  panStartMouseRef: RefObject<Point | null>,
  panStartOffsetRef: RefObject<Point | null>,
) {
  const dispatch = useAppDispatch();

  function initializePanState(event: PointerEvent<HTMLCanvasElement>) {
    panStartMouseRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    panStartOffsetRef.current = {
      ...panOffset,
    };
  }

  const handlePanMove = (clientX: number, clientY: number) => {
    const startMouse = panStartMouseRef.current;
    const startOffset = panStartOffsetRef.current;

    if (!startMouse || !startOffset) return;

    dispatch(
      setPanOffset({
        x: startOffset.x + clientX - startMouse.x,
        y: startOffset.y + clientY - startMouse.y,
      }),
    );
  };

  function stopMiddleMousePan() {
    isMiddleMousePanningRef.current = false;
  }

  return {
    handlePanMove,
  };
}
