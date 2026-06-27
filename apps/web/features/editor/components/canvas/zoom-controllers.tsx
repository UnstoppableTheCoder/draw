import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";

import { RefObject, useEffect } from "react";
import { MAX_SCALE, MIN_SCALE } from "../../constants/canvas";
import * as store from "../../store/selectors";
import { Point } from "@/types/canvas.types";
import useViewportHelpers from "../../hooks/viewport/use-viewport";

export default function ZoomControllers({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const panOffset = store.usePanOffset();
  const scale = store.useScale();
  const scaleOffset = store.useScaleOffset();
  const setScale = store.useSetScale();
  const setScaleOffset = store.useSetScaleOffset();

  const viewportHelpers = useViewportHelpers({
    canvasRef,
    panOffset,
    scale,
    scaleOffset,
  });

  const handleResetZoom = () => {
    setScale(1);
    setScaleOffset({ x: 0, y: 0 });
  };

  // const handleScrollBack = () => {
  //   setScale(1);
  //   setScaleOffset({ x: 0, y: 0 });
  //   setPanOffset({ x: 0, y: 0 });
  // };

  const handleZoom = (direction: "in" | "out", point?: Point) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let zoomPoint = point ?? { x: canvas.width / 2, y: canvas.height / 2 };

    const worldPoint = viewportHelpers.getScreenToCanvasCoordinates(
      zoomPoint.x,
      zoomPoint.y,
    );

    const newScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, direction === "in" ? scale + 0.1 : scale - 0.1),
    );

    if (newScale === scale || !worldPoint) return;

    const newOffset = {
      x: zoomPoint.x - panOffset.x - worldPoint.x * newScale,
      y: zoomPoint.y - panOffset.y - worldPoint.y * newScale,
    };

    setScale(newScale);
    setScaleOffset(newOffset);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();

        const screenCoordinates = {
          x: e.clientX,
          y: e.clientY,
        };

        if (e.deltaY > 0) {
          handleZoom("out", screenCoordinates);
        } else {
          handleZoom("in", screenCoordinates);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleZoom("out")}
        className="w-10 cursor-pointer rounded-none border-r border-neutral-200 p-0 hover:bg-neutral-100"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <button
        onClick={handleResetZoom}
        className="min-w-[64px] cursor-pointer border-r border-neutral-200 px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
      >
        {new Intl.NumberFormat("en-GB", {
          style: "percent",
        }).format(scale)}
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleZoom("in")}
        className="w-10 cursor-pointer rounded-none p-0 hover:bg-neutral-100"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
