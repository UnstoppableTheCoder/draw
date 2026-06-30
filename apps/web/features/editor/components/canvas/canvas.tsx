"use client";

import { useMemo, useRef } from "react";
import { usePointerState } from "../../hooks/pointer/use-pointer-state";
import CanvasEditor from "./canvas-editor";
import RendererProvider from "../../renderer/renderer-provider";

export default function Canvas() {
  const sceneCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRefs = usePointerState();

  const editorRefs = useMemo(
    () => ({
      sceneCanvasRef,
      overlayCanvasRef,
      pointerRefs,
    }),
    [pointerRefs],
  );

  return (
    <RendererProvider editorRefs={editorRefs}>
      <CanvasEditor editorRefs={editorRefs} />
    </RendererProvider>
  );
}
