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
      previewShape: Shape;
    }
  | {
      type: "select";
      activeShapeId: string;
      previewShape: Shape;
      dragOffset: Point;
      bounds: SelectedShapeBounds;
    }
  | {
      type: "move";
      activeShapeId: string;
      previewShape: Shape;
      dragOffset: Point;
      bounds: SelectedShapeBounds;
    }
  | {
      type: "resize";
      activeShapeId: string;
      previewShape: Shape;
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
      previewShape: Shape;
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
  const startPointRef = useRef<Point | null>(null);
  const drawingPointsRef = useRef<PointTuple[]>([]);
  const isPanningRef = useRef(false);
  const panStartMouseRef = useRef<Point | null>(null);
  const panStartOffsetRef = useRef<Point | null>(null);
  const pointerDownTimeRef = useRef<number | null>(null);
  const eraserPointsRef = useRef<EraserPoint[]>([]);
  const interactionRef = useRef<InteractionState>(createEmptyInteraction());

  useEffect(() => {
    isPointerDownRef.current = false;

    startPointRef.current = null;

    drawingPointsRef.current = [];

    isPanningRef.current = false;
    panStartMouseRef.current = null;
    panStartOffsetRef.current = null;

    pointerDownTimeRef.current = null;

    eraserPointsRef.current = [];

    resetInteraction(interactionRef);
  }, [selectedTool]);

  return {
    // Pointer
    isPointerDownRef,
    startPointRef,

    // Drawing
    drawingPointsRef,

    // Panning
    isPanningRef,
    panStartMouseRef,
    panStartOffsetRef,

    // Text
    pointerDownTimeRef,

    // Eraser
    eraserPointsRef,

    // Interaction
    interactionRef,
  };
}
