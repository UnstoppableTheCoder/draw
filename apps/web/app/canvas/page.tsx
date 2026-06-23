import React from "react";

import Canvas from "@/components/canvas/canvas";
import Toolbar from "@/components/toolbar/toolbar";
import { PropertiesPanel } from "@/components/properties-panel/properties-panel";

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
