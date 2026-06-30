"use client"

import { RefObject, useEffect, useRef } from "react";
import {
  EraserPoint,
  Point,
  PointTuple,
  SelectedShapeBounds,
  Shape,
} from "../../types/types";
import { ResizeHandleType } from "../../types/resize-handle";
import { useSelectedTool } from "../../store/selectors";

export type InteractionState =
  | {
      type: "none";
    }
  | {
      type: "draw";
      previewShape: Shape | null;
    }
  | {
      type: "select";
      activeShapeId: string;
      previewShape: Shape | null;
      bounds: SelectedShapeBounds;
    }
  | {
      type: "move";
      activeShapeId: string;
      previewShape: Shape | null;
      dragOffset: Point;
      bounds: SelectedShapeBounds;
    }
  | {
      type: "resize";
      activeShapeId: string;
      previewShape: Shape | null;
      handle: ResizeHandleType;
      bounds: SelectedShapeBounds;
      initialBounds: SelectedShapeBounds;
      initialFontSize?: number;
      freeDrawPoints?: PointTuple[];
      lineResizeState?: {
        start: Point;
        end: Point;
      };
    }
  | {
      type: "rotate";
      activeShapeId: string;
      previewShape: Shape | null;
      bounds: SelectedShapeBounds;
      startAngle: number;
      rotationCenter: Point;
    }
  | {
      type: "selection-box";
      startPoint: Point;
      endPoint: Point;
    };

export function createEmptyInteraction(): InteractionState {
  return {
    type: "none",
  };
}

export function resetInteraction(interactionRef: RefObject<InteractionState>) {
  interactionRef.current = createEmptyInteraction();
}

export function usePointerState() {
  const selectedTool = useSelectedTool();
  const isPointerDownRef = useRef(false);
  const drawingStartRef = useRef<Point | null>(null);
  const drawingPointsRef = useRef<PointTuple[]>([]);
  const isPanningRef = useRef(false);
  const panStartMouseRef = useRef<Point | null>(null);
  const panStartOffsetRef = useRef<Point | null>(null);
  const pointerDownTimeRef = useRef<number | null>(null);
  const eraserTrailRef = useRef<EraserPoint[]>([]);
  const interactionRef = useRef<InteractionState>(createEmptyInteraction());

  useEffect(() => {
    isPointerDownRef.current = false;

    drawingStartRef.current = null;

    drawingPointsRef.current = [];

    isPanningRef.current = false;
    panStartMouseRef.current = null;
    panStartOffsetRef.current = null;

    pointerDownTimeRef.current = null;

    eraserTrailRef.current = [];

    resetInteraction(interactionRef);
  }, [selectedTool]);

  return {
    // Pointer
    isPointerDownRef,
    drawingStartRef,

    // Drawing
    drawingPointsRef,

    // Panning
    isPanningRef,
    panStartMouseRef,
    panStartOffsetRef,

    // Text
    pointerDownTimeRef,

    // Eraser
    eraserTrailRef,

    // Interaction
    interactionRef,
  };
}
