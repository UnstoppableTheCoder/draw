import { ReactNode, RefObject } from "react";

import { RendererContext } from "./renderer-context";
import useCreateCanvasRenderer from "../hooks/renderer/use-create-canvas-renderer";
import { usePointerState } from "../hooks/pointer/use-pointer-state";

type RendererProviderProps = {
  children: ReactNode;
  editorRefs: {
    sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
    overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
    pointerRefs: ReturnType<typeof usePointerState>;
  };
};

export default function RendererProvider({
  children,
  editorRefs: { sceneCanvasRef, overlayCanvasRef, pointerRefs },
}: RendererProviderProps) {
  const renderer = useCreateCanvasRenderer({
    sceneCanvasRef,
    overlayCanvasRef,
    pointerRefs,
  });

  return (
    <RendererContext.Provider value={renderer}>
      {children}
    </RendererContext.Provider>
  );
}
