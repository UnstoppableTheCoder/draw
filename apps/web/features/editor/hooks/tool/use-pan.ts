import { RefObject } from "react";
import { Point } from "../../types/types";
import * as store from "../../store/selectors";

export default function usePan(
  panStartMouseRef: RefObject<Point | null>,
  panStartOffsetRef: RefObject<Point | null>,
) {
  const setPanOffset = store.useSetPanOffset();

  const handlePanMove = (clientX: number, clientY: number) => {
    const startMouse = panStartMouseRef.current;
    const startOffset = panStartOffsetRef.current;

    if (!startMouse || !startOffset) return;

    // End - Start = Pan Offset
    setPanOffset({
      x: startOffset.x + clientX - startMouse.x,
      y: startOffset.y + clientY - startMouse.y,
    });
  };

  return {
    handlePanMove,
  };
}
