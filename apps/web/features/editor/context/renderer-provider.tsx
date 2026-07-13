import { ReactNode } from "react";

import { RendererContext } from "./renderer-context";
import useCreateCanvasRenderer from "../renderer/use-create-canvas-renderer";
import { EditorRefs } from "@/features/editor/types";

type RendererProviderProps = {
  children: ReactNode;
  editorRefs: EditorRefs;
};

export default function RendererProvider({
  children,
  editorRefs: {
    backgroundCanvasRef,
    sceneCanvasRef,
    overlayCanvasRef,
    pointerRefs,
  },
}: RendererProviderProps) {
  const renderer = useCreateCanvasRenderer({
    backgroundCanvasRef,
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
