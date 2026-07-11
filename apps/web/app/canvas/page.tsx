"use client";

import Canvas from "@/features/editor/components/canvas/canvas";
import { PropertiesPanel } from "@/features/editor/components/properties-panel/properties-panel";
import Toolbar from "@/features/editor/components/toolbar/toolbar";
import RendererProvider from "@/features/editor/context/renderer-provider";
import { usePointerState } from "@/features/editor/pointer/use-pointer-state";
import { EditorRefs } from "@/types/editor";
import React, { useMemo, useRef } from "react";

const CanvasWrapper = () => {
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRefs = usePointerState();

  const editorRefs: EditorRefs = useMemo(
    () => ({
      backgroundCanvasRef,
      sceneCanvasRef,
      overlayCanvasRef,
      pointerRefs,
    }),
    [pointerRefs],
  );

  return (
    <div className="relative w-full h-full">
      <RendererProvider editorRefs={editorRefs}>
        <Toolbar />
        <PropertiesPanel editorRefs={editorRefs} />
        <Canvas editor={editorRefs} />
      </RendererProvider>
    </div>
  );
};

export default CanvasWrapper;
