import { Minus, Plus } from "lucide-react";
import { RefObject } from "react";

import * as store from "../../store/editor/selectors";
import useViewportZoom from "../../interactions/viewport/use-viewport-zoom";
import Hint from "../hint";
import CanvasButton from "./canvas-button";

export default function ZoomControllers({
  sceneCanvasRef,
}: {
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const scale = store.useScale();

  const { zoomIn, zoomOut, resetZoom } = useViewportZoom(sceneCanvasRef);

  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
      <CanvasButton onClick={zoomOut} label="Zoom out - Ctrl+-">
        <Minus className="size-4" />
      </CanvasButton>

      <Hint label="Reset zoom">
        <button
          onClick={resetZoom}
          className="min-w-[64px] cursor-pointer border-r border-neutral-200 px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          {new Intl.NumberFormat("en-GB", {
            style: "percent",
          }).format(scale)}
        </button>
      </Hint>

      <CanvasButton onClick={zoomIn} label="Zoom in - Ctrl++">
        <Plus className="size-4" />
      </CanvasButton>
    </div>
  );
}
