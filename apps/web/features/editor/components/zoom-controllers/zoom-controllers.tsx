import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";

import { RefObject, useEffect } from "react";
import { getScreenToCanvasCoordinates } from "../../utils/get-coordinates";
import { MAX_SCALE, MIN_SCALE } from "../../constants/canvas";
import * as store from "../../store/selectors";
import { Point } from "@/types/canvas.types";

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

    const worldPoint = getScreenToCanvasCoordinates({
      screenX: zoomPoint.x,
      screenY: zoomPoint.y,
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
    <div className="flex items-center space-x-2 bg-neutral-200 rounded-md">
      <Button
        onClick={() => handleZoom("out")}
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
        onClick={() => handleZoom("in")}
        size="sm"
        variant={"outline"}
        className="cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
