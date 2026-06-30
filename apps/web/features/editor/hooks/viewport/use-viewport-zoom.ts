import { RefObject, useCallback, useEffect } from "react";
import { MAX_SCALE, MIN_SCALE } from "../../constants/canvas";
import * as store from "../../store/selectors";
import { Point } from "../../types/types";
import useViewportHelpers from "./use-viewport-helpers";
import { useCanvasRenderer } from "../../renderer/use-renderer";

const ZOOM_STEP = 0.1;

export default function useViewportZoom(
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const scale = store.useScale();
  const panOffset = store.usePanOffset();
  const setScale = store.useSetScale();
  const setScaleOffset = store.useSetScaleOffset();

  const viewport = useViewportHelpers(sceneCanvasRef);
  const { invalidate } = useCanvasRenderer();

  const zoomToPoint = useCallback(
    (targetScale: number, screenPoint: Point) => {
      const worldPoint = viewport.clientToCanvas(screenPoint.x, screenPoint.y);
      if (!worldPoint) return;

      const clampedScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, targetScale),
      );

      if (clampedScale === scale) return;

      setScale(clampedScale);
      setScaleOffset({
        x: screenPoint.x - panOffset.x - worldPoint.x * clampedScale,
        y: screenPoint.y - panOffset.y - worldPoint.y * clampedScale,
      });
    },
    [scale, panOffset, viewport, setScale, setScaleOffset],
  );

  const zoomIn = useCallback(() => {
    const canvas = sceneCanvasRef.current;
    if (!canvas) return;

    zoomToPoint(scale + ZOOM_STEP, {
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    invalidate();
  }, [sceneCanvasRef, scale, zoomToPoint, invalidate]);

  const zoomOut = useCallback(() => {
    const canvas = sceneCanvasRef.current;
    if (!canvas) return;

    zoomToPoint(scale - ZOOM_STEP, {
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    invalidate();
  }, [sceneCanvasRef, scale, zoomToPoint, invalidate]);

  const handleWheelZoom = useCallback(
    (e: WheelEvent) => {
      if (!e.ctrlKey) return;

      e.preventDefault();

      zoomToPoint(e.deltaY < 0 ? scale + ZOOM_STEP : scale - ZOOM_STEP, {
        x: e.clientX,
        y: e.clientY,
      });
      invalidate();
    },
    [scale, zoomToPoint, invalidate],
  );

  const resetZoom = useCallback(() => {
    setScale(1);
    setScaleOffset({ x: 0, y: 0 });

    invalidate();
  }, [setScale, setScaleOffset, invalidate]);

  const zoomToFit = useCallback(() => {
    // TODO
  }, []);

  const zoomToSelection = useCallback(() => {
    // TODO
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheelZoom, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWheelZoom);
    };
  }, [handleWheelZoom]);

  return {
    zoomIn,
    zoomOut,
    handleWheelZoom,
    resetZoom,
    zoomToFit,
    zoomToSelection,
  };
}
