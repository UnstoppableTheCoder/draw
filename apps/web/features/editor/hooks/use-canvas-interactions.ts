import {
  Dispatch,
  PointerEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Point,
  PointTuple,
  SelectedShapeBounds,
  Shape,
  TextEditingState,
} from "../types/types";
import { ToolType } from "@/types/toolbar.types";
import { createShape } from "../shapes/create-shape";
import { renderShapes } from "../draw/render-shapes";
import { updateDrawingPoints } from "../shapes/update-shape";
import { setTool } from "@/features/toolbar/toolbar-slice";
import { useAppDispatch } from "@/hooks/hooks";
import { TOOLS_WITH_POINTS } from "../constants/tools";
import { getScreenToCanvasCoordinates } from "../utils/get-coordinates";
import { setPanOffset } from "@/features/viewport/viewport-slice";
import { getShapeAtPosition } from "../geometry/hit-test";
import {
  getBoundingBox,
  getResizeHandleAtPoint,
} from "../geometry/bounding-box";
import { ResizeHandleType } from "../types/resize-handle";
import { getAbsolutePoint } from "../utils/get-absolute-point";
import usePan from "./use-pan";
import useShapeResize from "./use-shape-resize";
import useShapeMove from "./use-shape-move";
import { renderPreviewShape } from "../shapes/render-preview-shape";

interface UseCanvasDrawingProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  shapes: Shape[];
  setShapes: Dispatch<SetStateAction<Shape[]>>;
  setTextEditingState: Dispatch<SetStateAction<TextEditingState | null>>;
  selectedTool: ToolType;
  panOffset: Point;
  scale: number;
  scaleOffset: Point;
}

export default function useCanvasDrawing({
  canvasRef,
  shapes,
  setShapes,
  setTextEditingState,
  selectedTool,
  panOffset,
  scale,
  scaleOffset,
  handlePanMove,
  resizeShape,
  moveShape,
}: UseCanvasDrawingProps) {
  const isPointerDownRef = useRef<boolean>(false);
  // StartPoint -> Canvas Coordinate
  const startPointRef = useRef<Point | null>(null);
  const drawingPointsRef = useRef<PointTuple[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const panStartMouseRef = useRef<Point | null>(null);
  const panStartOffsetRef = useRef<Point | null>(null);
  const dispatch = useAppDispatch();
  const isMiddleMousePanningRef = useRef<boolean>(false);
  // Not the right place to keep
  const [selectedShapeBounds, setSelectedShapeBounds] =
    useState<SelectedShapeBounds | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const isResizingRef = useRef(false);
  const resizableHandleRef = useRef<ResizeHandleType | null>(null);
  const lastPointerRef = useRef<Point | null>(null);
  // Todo: Check if you can replace it
  const resizeStartBoundsRef = useRef<SelectedShapeBounds | null>(null);
  const lineResizeStateRef = useRef<{
    start: Point;
    end: Point;
  } | null>(null);
  const freeDrawShapePointsRef = useRef<PointTuple[]>([]);

  // Hooks

  // ========= Pointer Down Functions =========
  function clearSelection() {
    setSelectedShape(null);
    setSelectedShapeBounds(null);
  }

  function initializePointerState(
    event: PointerEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
  ) {
    canvas.setPointerCapture(event.pointerId);
    isPointerDownRef.current = true;

    const point = getScreenToCanvasCoordinates({
      screenX: event.clientX,
      screenY: event.clientY,
      canvas,
      panOffset,
      scale,
      scaleOffset,
    });

    startPointRef.current = point;
    lastPointerRef.current = point;

    return point;
  }

  function initializeDrawingPoints() {
    drawingPointsRef.current = [[0, 0]];
  }

  function handleMiddleMousePan(event: PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 1) {
      return false;
    }

    isMiddleMousePanningRef.current = true;

    panStartMouseRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    panStartOffsetRef.current = {
      ...panOffset,
    };

    return true;
  }

  // Initializing on Pointer Down -> Resizing will happen on Pointer Move
  function initializeResize({
    resizeHandle,
    bounds,
    shapeAtPosition,
  }: {
    resizeHandle: ResizeHandleType;
    bounds: SelectedShapeBounds;
    shapeAtPosition: Shape;
  }) {
    isResizingRef.current = true;
    resizableHandleRef.current = resizeHandle;
    resizeStartBoundsRef.current = bounds;

    if (shapeAtPosition.type === "line" || shapeAtPosition.type === "arrow") {
      const [startRel, endRel] = shapeAtPosition.points;
      if (!startRel || !endRel) return;

      const start = getAbsolutePoint(
        shapeAtPosition.x,
        shapeAtPosition.y,
        startRel,
      );

      const end = getAbsolutePoint(
        shapeAtPosition.x,
        shapeAtPosition.y,
        endRel,
      );

      lineResizeStateRef.current = {
        start,
        end,
      };

      return;
    }

    if (shapeAtPosition.type === "freedraw") {
      resizeStartBoundsRef.current = getBoundingBox(shapeAtPosition);
      freeDrawShapePointsRef.current = shapeAtPosition.points.map((p) => [
        ...p,
      ]);
    }
  }

  function handleSelectPointerDown(startPoint: Point) {
    const shapeAtPosition = getShapeAtPosition(
      startPoint,
      shapes,
      selectedShape,
      selectedShapeBounds,
    );
    console.log(shapeAtPosition);

    if (!shapeAtPosition) return;

    setSelectedShape(shapeAtPosition);
    const bounds = getBoundingBox(shapeAtPosition);
    setSelectedShapeBounds(bounds);

    // Get the resize handle you clicked on
    const resizeHandle = getResizeHandleAtPoint(
      startPoint,
      shapeAtPosition,
      bounds,
      scale,
    );

    // Disable Resize if no resizeHandle
    if (!resizeHandle) {
      isResizingRef.current = false;
      return;
    }

    initializeResize({ resizeHandle, bounds, shapeAtPosition });
  }

  function initializePanState(event: PointerEvent<HTMLCanvasElement>) {
    panStartMouseRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    panStartOffsetRef.current = {
      ...panOffset,
    };
  }

  function initializeTextEditing(startPoint: Point) {
    setTextEditingState({
      x: startPoint.x,
      y: startPoint.y,
      text: "",
    });
  }

  function renderFreeDrawDotPreview(startPoint: Point) {
    const ctx = contextRef.current;
    if (!ctx) return;

    renderPreviewShape({
      ctx,
      tool: selectedTool,
      startPoint,
      endPoint: startPoint,
      points: drawingPointsRef.current,
      shapes,
      scale,
      panOffset,
      scaleOffset,
    });
  }

  function handleToolPointerDown(
    event: PointerEvent<HTMLCanvasElement>,
    startPoint: Point,
  ) {
    switch (selectedTool) {
      case "select":
        handleSelectPointerDown(startPoint);
        break;

      case "freedraw":
        renderFreeDrawDotPreview(startPoint);
        break;

      case "text":
        initializeTextEditing(startPoint);
        break;

      case "pan":
        initializePanState(event);
        break;
    }

    if (TOOLS_WITH_POINTS.includes(selectedTool)) {
      initializeDrawingPoints();
    }
  }

  // ========= Pointer Move Functions =========
  const getCurrentCanvasPoint = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ): Point => {
    return getScreenToCanvasCoordinates({
      screenX: event.clientX,
      screenY: event.clientY,
      canvas: event.currentTarget,
      panOffset,
      scale,
      scaleOffset,
    });
  };

  // UI - Cursor Type
  function updateResizeCursor(point: Point, selectedShape: Shape) {
    const resizeHandle = getResizeHandleAtPoint(
      point,
      selectedShape,
      selectedShapeBounds,
      scale,
    );

    resizableHandleRef.current = resizeHandle;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!resizeHandle) {
      canvas.style.cursor = "default";
      return;
    }

    switch (resizeHandle) {
      case "top":
      case "bottom":
        canvas.style.cursor = "ns-resize";
        break;

      case "left":
      case "right":
        canvas.style.cursor = "ew-resize";
        break;

      case "top-left":
      case "bottom-right":
        canvas.style.cursor = "nwse-resize";
        break;

      case "top-right":
      case "bottom-left":
        canvas.style.cursor = "nesw-resize";
        break;

      case "start":
      case "middle":
      case "end":
        canvas.style.cursor = "pointer";
        break;
    }
  }

  function handleSelectedShapeInteraction(
    selectedShape: Shape,
    endPoint: Point,
    dx: number,
    dy: number,
  ) {
    if (!isPointerDownRef.current) {
      updateResizeCursor(endPoint, selectedShape);
      return true;
    }

    if (isResizingRef.current) {
      resizeShape(selectedShape, endPoint);
    } else {
      moveShape({
        selectedShape,
        dx,
        dy,
      });
    }

    return true;
  }

  function renderDrawingPreview(
    ctx: CanvasRenderingContext2D,
    startPoint: Point,
    endPoint: Point,
  ) {
    const relativePoint: PointTuple = [
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

  function getPointerDelta(endPoint: Point) {
    const last = lastPointerRef.current;

    if (!last) return null;

    const dx = endPoint.x - last.x;
    const dy = endPoint.y - last.y;

    lastPointerRef.current = endPoint;

    return { dx, dy };
  }

  // ========= Pointer Up Functions =========
  function stopMiddleMousePan() {
    isMiddleMousePanningRef.current = false;
  }

  function cleanupInteractionState() {
    isPointerDownRef.current = false;
    resizableHandleRef.current = null;
    resizeStartBoundsRef.current = null;
    lineResizeStateRef.current = null;
  }

  function resetToolAfterDrawing() {
    if (selectedTool === "pan" || selectedTool === "freedraw") {
      return;
    }

    dispatch(
      setTool({
        tool: "select",
      }),
    );
  }

  function getPointerUpPoint(event: PointerEvent<HTMLCanvasElement>): Point {
    return getScreenToCanvasCoordinates({
      screenX: event.clientX,
      screenY: event.clientY,
      canvas: event.currentTarget,
      panOffset,
      scale,
      scaleOffset,
    });
  }

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

  function finishResize() {
    if (!isResizingRef.current) {
      return false;
    }

    isResizingRef.current = false;
    return true;
  }

  function completeDrawing(event: PointerEvent<HTMLCanvasElement>) {
    const startPoint = startPointRef.current;
    if (!startPoint) return;

    const endPoint = getPointerUpPoint(event);

    finalizeShape(startPoint, endPoint);
  }

  // ========= DOM Event Handlers =========
  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    clearSelection();
    if (handleMiddleMousePan(event)) return;

    const canvas = event.currentTarget;
    const startPoint = initializePointerState(event, canvas);

    handleToolPointerDown(event, startPoint);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (
      (selectedTool === "pan" && isPointerDownRef.current) ||
      isMiddleMousePanningRef.current
    ) {
      handlePanMove(event.clientX, event.clientY);
      return;
    }

    const ctx = contextRef.current;
    if (!ctx) return;

    const startPoint = startPointRef.current;
    if (!startPoint) return;

    const endPoint = getCurrentCanvasPoint(event);

    const delta = getPointerDelta(endPoint);
    if (!delta) return;
    const { dx, dy } = delta;

    if (selectedTool === "select" && selectedShape) {
      const handled = handleSelectedShapeInteraction(
        selectedShape,
        endPoint,
        dx,
        dy,
      );

      if (handled) return;
    }

    renderDrawingPreview(ctx, startPoint, endPoint);
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.button === 1) {
      stopMiddleMousePan();
      return;
    }

    cleanupInteractionState();
    if (finishResize()) {
      return;
    }

    resetToolAfterDrawing();
    completeDrawing(event);
  };

  const resetDrawingState = () => {
    startPointRef.current = null;
    drawingPointsRef.current = [];
  };

  // Context Ref
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");
    if (!canvasContext) return;

    contextRef.current = canvasContext;
  }, []);

  // Render Shapes
  useEffect(() => {
    const ctx = contextRef.current;
    if (!ctx) return;

    renderShapes({
      ctx,
      shapes,
      scale,
      panOffset,
      scaleOffset,
      bounds: selectedShapeBounds,
      selectedShape,
    });

    ctx.restore();
  }, [
    shapes,
    scale,
    panOffset,
    scaleOffset,
    selectedShapeBounds,
    selectedShape,
  ]);

  // Moves the page up and down and left and right
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) {
        dispatch(
          setPanOffset({
            x: panOffset.x - e.deltaX,
            y: panOffset.y - e.deltaY,
          }),
        );
      }

      if (e.shiftKey) {
        dispatch(
          setPanOffset({
            x: panOffset.x - e.deltaY,
            y: panOffset.y - e.deltaX,
          }),
        );
      }
    };

    window.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [dispatch, panOffset]);

  // Sets the value of startPoint to null when a tool is selected
  useEffect(() => {
    startPointRef.current = null;
  }, [selectedTool]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    contextRef,
  };
}


