"use client";

import { RefObject, useEffect, useRef } from "react";
import {
  EraserPoint,
  Point,
  PointTuple,
  SelectedBounds,
  Shape,
} from "../../types/types";
import { ResizeHandleType } from "../../types/resize-handle";
import { useSelectedTool } from "../../store/editor/selectors";

type InteractionSelection = {
  previewShapes: Shape[];
  groupBounds: SelectedBounds;
};

export type InteractionState =
  | {
      type: "none";
    }
  | {
      type: "draw";
      previewShape: Shape | null;
    }
  | ({
      type: "select";
    } & InteractionSelection)
  | ({
      type: "move";
      dragOffsets: Record<string, Point>;
    } & InteractionSelection)
  | ({
      type: "resize";
      handle: ResizeHandleType;
      initialShapes: Shape[];
      initialGroupBounds: SelectedBounds;

      // Used only for specific shape types
      initialFontSizes?: Record<string, number>;
      freeDrawPoints?: Record<string, PointTuple[]>;
      lineResizeStates?: Record<
        string,
        {
          start: Point;
          end: Point;
        }
      >;
    } & InteractionSelection)
  | ({
      type: "rotate";
      startAngle: number;
      rotationCenter: Point;
    } & InteractionSelection)
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

  // Pointer
  const isPointerDownRef = useRef(false);

  // Drawing
  const drawingStartRef = useRef<Point | null>(null);
  const drawingPointsRef = useRef<PointTuple[]>([]);

  // Panning
  const isPanningRef = useRef(false);
  const panStartMouseRef = useRef<Point | null>(null);
  const panStartOffsetRef = useRef<Point | null>(null);

  // Text
  const pointerDownTimeRef = useRef<number | null>(null);

  // Eraser
  const eraserTrailRef = useRef<EraserPoint[]>([]);

  // Current interaction
  const interactionRef = useRef<InteractionState>(createEmptyInteraction());

  // Dragging
  const isDraggingRef = useRef<boolean>(false);

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

    isDraggingRef.current = false;
  }, [selectedTool]);

  return {
    // Pointer
    isPointerDownRef,

    // Drawing
    drawingStartRef,
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

    // Dragging
    isDraggingRef
  };
}
