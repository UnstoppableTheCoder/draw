import { ToolType } from "@/types/toolbar.types";
import {
  EraserPoint,
  InteractionMode,
  Point,
  PointTuple,
  SelectedBounds,
  Shape,
  TextEditingState,
  TextShape,
} from "../../types/types";

export interface EditorStore {
  // Tool
  selectedTool: ToolType;
  isLocked: boolean;

  setSelectedTool: (tool: ToolType) => void;
  setIsLocked: (lock: boolean) => void;

  // Shapes
  shapes: Shape[];
  setShapes: (updater: Shape[] | ((prev: Shape[]) => Shape[])) => void;

  // Eraser Points
  eraserPoints: EraserPoint[];
  setEraserPoints: (
    updater: EraserPoint[] | ((prev: EraserPoint[]) => EraserPoint[]),
  ) => void;

  // Selection
  selectedShapeIds: string[];
  setSelectedShapeIds: (
    updater: string[] | ((prev: string[]) => string[]),
  ) => void;

  selectionBounds: SelectedBounds | null;
  setSelectionBounds: (bounds: SelectedBounds | null) => void;

  // Text Editing
  textEditingState: TextEditingState | null;
  setTextEditingState: (
    updater:
      | TextEditingState
      | null
      | ((prev: TextEditingState | null) => TextEditingState | null),
  ) => void;

  // Viewport
  scale: number;
  setScale: (scale: number) => void;

  panOffset: Point;
  setPanOffset: (updater: Point | ((prev: Point) => Point)) => void;

  scaleOffset: Point;
  setScaleOffset: (offset: Point) => void;

  // History
  undoStack: Shape[][];
  redoStack: Shape[][];
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Text Style
  fontSize: number;
  setFontSize: (size: number) => void;

  fontFamily: string;
  setFontFamily: (family: string) => void;

  lineHeightMultiplier: number;
  setLineHeightMultiplier: (value: number) => void;
}
