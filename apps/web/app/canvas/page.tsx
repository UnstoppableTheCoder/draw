import Canvas from "@/features/editor/components/canvas/canvas";
import { PropertiesPanel } from "@/features/editor/components/properties-panel/properties-panel";
import Toolbar from "@/features/editor/components/toolbar/toolbar";
import React from "react";

const CanvasWrapper = () => {
  return (
    <div className="relative w-full h-full">
      <Toolbar />
      <PropertiesPanel />
      <Canvas />
    </div>
  );
};

export default CanvasWrapper;
