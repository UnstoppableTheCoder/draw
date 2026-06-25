import { ToolType } from "@/types/toolbar.types";
import {
  InteractionMode,
  Point,
  PointTuple,
  SelectedShapeBounds,
  Shape,
  TextEditingState,
} from "../types/types";

export interface EditorStore {
  // Tool
  selectedTool: ToolType;
  isLocked: boolean;

  setSelectedTool: (tool: ToolType) => void;
  setIsLocked: (lock: boolean) => void;

  // Interaction Mode
  interactionMode: InteractionMode;
  setInteractionMode: (mode: InteractionMode) => void;

  // Shapes
  shapes: Shape[];
  setShapes: (updater: Shape[] | ((prev: Shape[]) => Shape[])) => void;

  // Eraser Points
  eraserPoints: PointTuple[];
  setEraserPoints: (
    updater: PointTuple[] | ((prev: PointTuple[]) => PointTuple[]),
  ) => void;

  // Selection
  selectedShape: Shape | null;
  setSelectedShape: (
    updater: Shape | null | ((prev: Shape | null) => Shape | null),
  ) => void;

  selectedShapeBounds: SelectedShapeBounds | null;
  setSelectedShapeBounds: (shape: SelectedShapeBounds | null) => void;

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
  history: Shape[][];
  setHistory: (updater: Shape[][] | ((prev: Shape[][]) => Shape[][])) => void;

  redoStack: Shape[][];
  setRedoStack: (updater: Shape[][] | ((prev: Shape[][]) => Shape[][])) => void;

  // Text Style
  fontSize: number;
  setFontSize: (size: number) => void;

  fontFamily: string;
  setFontFamily: (family: string) => void;

  lineHeightMultiplier: number;
  setLineHeightMultiplier: (value: number) => void;
}
