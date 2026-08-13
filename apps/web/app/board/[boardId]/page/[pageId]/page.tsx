"use client";

import { Button } from "@/components/ui/button";
import Canvas from "@/features/editor/components/canvas/canvas";
import LeftSidebar from "@/features/editor/components/left-sidebar/left-sidebar";
import { PropertiesPanel } from "@/features/editor/components/properties-panel/properties-panel";
import Toolbar from "@/features/editor/components/toolbar/toolbar";
import RendererProvider from "@/features/editor/context/renderer-provider";
import { useInitializeEditor } from "@/features/editor/hooks/use-initialization-editor";
import { useImageManager } from "@/features/editor/interactions/manager/image-manager";
import { usePointerState } from "@/features/editor/pointer/use-pointer-state";
import { EditorRefs } from "@/features/editor/types/editor";
import { PanelLeftOpen } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";

const Board = () => {
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRefs = usePointerState();
  const imageManager = useImageManager();

  const editorRefs: EditorRefs = useMemo(
    () => ({
      backgroundCanvasRef,
      sceneCanvasRef,
      overlayCanvasRef,
      pointerRefs,
      imageManager,
    }),
    [pointerRefs],
  );

  const { error, loading } = useInitializeEditor();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <RendererProvider editorRefs={editorRefs}>
        {isSidebarOpen && (
          <div className="absolute inset-y-0 left-0 z-40">
            <LeftSidebar onCollapse={() => setIsSidebarOpen(false)} />
          </div>
        )}

        {!isSidebarOpen && (
          <Button
            aria-label="Expand sidebar"
            title="Expand sidebar"
            onClick={() => setIsSidebarOpen(true)}
            variant="secondary"
            size="icon"
            className="absolute left-3 top-3 z-40 hidden shadow-lg md:inline-flex"
          >
            <PanelLeftOpen />
          </Button>
        )}

        <Toolbar />
        <PropertiesPanel
          editorRefs={editorRefs}
          isSidebarOpen={isSidebarOpen}
        />
        <Canvas editor={editorRefs} isSidebarOpen={isSidebarOpen} />
      </RendererProvider>
    </div>
  );
};

export default Board;
