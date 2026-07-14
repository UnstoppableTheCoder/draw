"use client";

import Canvas from "@/features/editor/components/canvas/canvas";
import { PropertiesPanel } from "@/features/editor/components/properties-panel/properties-panel";
import LeftSidebar from "@/features/editor/components/sidebar/left-sidebar";
import Toolbar from "@/features/editor/components/toolbar/toolbar";
import { Button } from "@/features/editor/components/ui/button";
import RendererProvider from "@/features/editor/context/renderer-provider";
import { usePointerState } from "@/features/editor/pointer/use-pointer-state";
import { EditorRefs } from "@/features/editor/types/editor";
import { PanelLeftOpen } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";

const BoardWrapper = () => {
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState(0);

  return (
    <div className="flex h-full w-full">
      <RendererProvider editorRefs={editorRefs}>
        {isSidebarOpen && (
          <LeftSidebar
            activePage={activePage}
            setActivePage={setActivePage}
            onCollapse={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="relative flex-1 overflow-hidden">
          {!isSidebarOpen && (
            <Button
              aria-label="Expand sidebar"
              title="Expand sidebar"
              onClick={() => setIsSidebarOpen(true)}
              variant="secondary"
              size="icon"
              className="absolute left-3 top-3 z-50 hidden shadow-lg md:inline-flex"
            >
              <PanelLeftOpen />
            </Button>
          )}

          <Toolbar />
          <PropertiesPanel editorRefs={editorRefs} />
          <Canvas editor={editorRefs} />
        </div>
      </RendererProvider>
    </div>
  );
};

export default BoardWrapper;
