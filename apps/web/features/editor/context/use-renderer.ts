import { useContext } from "react";
import { RendererContext } from "./renderer-context";

export function useCanvasRenderer() {
  const renderer = useContext(RendererContext);

  if (!renderer) {
    throw new Error("useCanvasRenderer must be used inside RendererProvider");
  }

  return renderer;
}
