"use client";

import Canvas from "@/features/editor/components/canvas/canvas";
import { PropertiesPanel } from "@/features/editor/components/properties-panel/properties-panel";
import Toolbar from "@/features/editor/components/toolbar/toolbar";
import RendererProvider from "@/features/editor/context/renderer-provider";
import { usePointerState } from "@/features/editor/hooks/pointer/use-pointer-state";
import React, { useMemo, useRef } from "react";

const CanvasWrapper = () => {
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
    <div className="relative w-full h-full">
      <RendererProvider editorRefs={editorRefs}>
        <Toolbar />
        <PropertiesPanel editorRefs={editorRefs} />
        <Canvas editorRefs={editorRefs} />
      </RendererProvider>
    </div>
  );
};

export default CanvasWrapper;
