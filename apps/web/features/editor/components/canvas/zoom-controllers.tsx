import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { RefObject } from "react";

import * as store from "../../store/selectors";
import useViewportZoom from "../../hooks/viewport/use-viewport-zoom";

export default function ZoomControllers({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const scale = store.useScale();

  const { zoomIn, zoomOut, resetZoom } = useViewportZoom(sceneCanvasRef);

  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={zoomOut}
        className="w-10 cursor-pointer rounded-none border-r border-neutral-200 p-0 hover:bg-neutral-100"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <button
        onClick={resetZoom}
        className="min-w-[64px] cursor-pointer border-r border-neutral-200 px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
      >
        {new Intl.NumberFormat("en-GB", {
          style: "percent",
        }).format(scale)}
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={zoomIn}
        className="w-10 cursor-pointer rounded-none p-0 hover:bg-neutral-100"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
