import { useState } from "react";
import { Shape } from "../types/types";

export default function useShapes() {
  const [shapes, setShapes] = useState<Shape[]>([]);

  const addShape = (shape: Shape) => {
    setShapes((prev) => [...prev, shape]);
  };

  //   const updateShape = (id: string, type: ToolType, updates: Partial<Shape>) => {
  //     setShapes((prev) =>
  //       prev.map((shape) =>
  //         shape.id === id && shape.type === type
  //           ? { ...shape, ...updates }
  //           : shape,
  //       ),
  //     );
  //   };

  function finalizeShape(startPoint: Point, endPoint: Point) {
    const shape = createShape({
      tool: selectedTool,
      startPoint,
      endPoint,
      points: drawingPointsRef.current,
    });

    if (!shape) return;

    setShapes((prev) => [...prev, shape]);
    resetDrawingState();
  }

  return { shapes, setShapes, addShape };
}
