import { useRef } from "react";
import { Point, PointTuple, SelectedShapeBounds } from "../types/types";
import { ResizeHandleType } from "../types/resize-handle";

export function usePointerState() {
  const isPointerDownRef = useRef(false);
  const startPointRef = useRef<Point | null>(null);
  const lastPointerRef = useRef<Point | null>(null);

  const drawingPointsRef = useRef<PointTuple[]>([]);
  const isPanningRef = useRef(false);

  const panStartMouseRef = useRef<Point | null>(null);
  const panStartOffsetRef = useRef<Point | null>(null);

  const isResizingRef = useRef(false);
  const resizableHandleRef = useRef<ResizeHandleType | null>(null);
  const resizeStartFontSizeRef = useRef<number | null>(null);
  const resizeStartBoundsRef = useRef<SelectedShapeBounds | null>(null);
  const lineResizeStateRef = useRef<{
    start: Point;
    end: Point;
  } | null>(null);

  const freeDrawShapePointsRef = useRef<PointTuple[]>([]);

  // Refs for text editing
  const pointerDownTimeRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  return {
    isPointerDownRef,

    startPointRef,
    lastPointerRef,

    drawingPointsRef,

    isPanningRef,

    panStartMouseRef,
    panStartOffsetRef,

    isResizingRef,
    resizableHandleRef,
    resizeStartBoundsRef,
    resizeStartFontSizeRef,

    lineResizeStateRef,
    freeDrawShapePointsRef,

    pointerDownTimeRef,
    isDraggingRef,
  };
}
