// import { RefObject, useRef } from "react";

// import { ToolType } from "@/types/toolbar.types";

// import { Point, PointTuple, Shape } from "../types/types";

// import { createShape } from "../shapes/create-shape";
// import { updateDrawingPoints } from "../shapes/update-shape";
// import { renderPreviewShape } from "../shapes/render-preview-shape";

// interface UseCanvasDrawingProps {
//   selectedTool: ToolType;
//   shapes: Shape[];
//   setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
//   scale: number;
//   panOffset: Point;
//   scaleOffset: Point;
//   contextRef: RefObject<CanvasRenderingContext2D | null>;
// }

// export function useCanvasDrawing({
//   selectedTool,
//   shapes,
//   setShapes,
//   scale,
//   panOffset,
//   scaleOffset,
//   contextRef,
// }: UseCanvasDrawingProps) {
//   const drawingPointsRef = useRef<PointTuple[]>([]);

//   function initializeDrawingPoints() {
//     drawingPointsRef.current = [[0, 0]];
//   }

//   function resetDrawingState() {
//     drawingPointsRef.current = [];
//   }

//   function renderFreeDrawDotPreview(startPoint: Point) {
//     const ctx = contextRef.current;
//     if (!ctx) return;

//     renderPreviewShape({
//       ctx,
//       tool: selectedTool,
//       startPoint,
//       endPoint: startPoint,
//       points: drawingPointsRef.current,
//       shapes,
//       scale,
//       panOffset,
//       scaleOffset,
//     });
//   }

//   function renderDrawingPreview(startPoint: Point, endPoint: Point) {
//     const ctx = contextRef.current;
//     if (!ctx) return;

//     const relativePoint: PointTuple = [
//       endPoint.x - startPoint.x,
//       endPoint.y - startPoint.y,
//     ];

//     drawingPointsRef.current = updateDrawingPoints({
//       tool: selectedTool,
//       relativePoint,
//       currentPoints: drawingPointsRef.current,
//     });

//     renderPreviewShape({
//       ctx,
//       tool: selectedTool,
//       startPoint,
//       endPoint,
//       points: drawingPointsRef.current,
//       shapes,
//       scale,
//       panOffset,
//       scaleOffset,
//     });
//   }

//   function createFinalShape(startPoint: Point, endPoint: Point) {
//     const shape = createShape({
//       tool: selectedTool,
//       startPoint,
//       endPoint,
//       points: drawingPointsRef.current,
//     });

//     if (!shape) return null;

//     setShapes((prev) => [...prev, shape]);

//     resetDrawingState();

//     return shape;
//   }

//   return {
//     drawingPointsRef,
//     initializeDrawingPoints,
//     renderDrawingPreview,
//     renderFreeDrawDotPreview,
//     createFinalShape,
//     resetDrawingState,
//   };
// }

export function useCanvasDrawing({
  selectedTool,
  shapes,
  scale,
  panOffset,
  scaleOffset,
}) {
  function initializeDrawingPoints(drawingPointsRef) {
    drawingPointsRef.current = [[0, 0]];
  }

  function renderDrawingPreview({
    ctx,
    startPoint,
    endPoint,
    drawingPointsRef,
  }) {
    const relativePoint = [
      endPoint.x - startPoint.x,
      endPoint.y - startPoint.y,
    ];

    drawingPointsRef.current = updateDrawingPoints({
      tool: selectedTool,
      relativePoint,
      currentPoints: drawingPointsRef.current,
    });

    renderPreviewShape({
      ctx,
      tool: selectedTool,
      startPoint,
      endPoint,
      points: drawingPointsRef.current,
      shapes,
      scale,
      panOffset,
      scaleOffset,
    });
  }

  function finalizeShape({ startPoint, endPoint, drawingPoints }) {
    return createShape({
      tool: selectedTool,
      startPoint,
      endPoint,
      points: drawingPoints,
    });
  }

  return {
    initializeDrawingPoints,
    renderDrawingPreview,
    finalizeShape,
  };
}
