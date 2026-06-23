import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";

import { RefObject, useEffect } from "react";
import { Point } from "@/types/canvas.types";
import { getScreenToCanvasCoordinates } from "../../utils/get-coordinates";
import { MAX_SCALE, MIN_SCALE } from "../../constants/canvas";
import * as store from "../../store/selectors";

export default function ZoomControllers({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const canvas = canvasRef.current;
  const panOffset = store.usePanOffset();
  const scale = store.useScale();
  const scaleOffset = store.useScaleOffset();
  const setScale = store.useSetScale();
  const setScaleOffset = store.useSetScaleOffset();

  const handleResetZoom = () => {};

  const handleZoom = (direction: "in" | "out", point: Point) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const worldPoint = getScreenToCanvasCoordinates({
      screenX: point.x,
      screenY: point.y,
      canvas,
      panOffset,
      scale,
      scaleOffset,
    });

    const newScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, direction === "in" ? scale + 0.1 : scale - 0.1),
    );

    if (newScale === scale) return;

    const newOffset = {
      x: point.x - panOffset.x - worldPoint.x * newScale,
      y: point.y - panOffset.y - worldPoint.y * newScale,
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

  if (!canvas) return;
  const point = { x: canvas?.width / 2, y: canvas?.height / 2 };
  return (
    <div className="flex items-center space-x-2 bg-neutral-200 rounded-md">
      <Button
        onClick={() => handleZoom("out", point)}
        size="sm"
        variant={"outline"}
        className="cursor-pointer"
      >
        <Minus className="w-4 h-4" />
      </Button>

      <p className="text-sm cursor-pointer" onClick={handleResetZoom}>
        {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
      </p>

      <Button
        onClick={() => handleZoom("in", point)}
        size="sm"
        variant={"outline"}
        className="cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
