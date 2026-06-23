import { ToolType } from "@/types/toolbar.types";
import {
  InteractionMode,
  Point,
  SelectedShapeBounds,
  Shape,
  TextEditingState,
} from "../types/types";

export interface EditorStore {
  // Tool
  selectedTool: ToolType;
  lockTool: boolean;

  setSelectedTool: (tool: ToolType) => void;
  setLockTool: (lock: boolean) => void;

  // Interaction Mode
  interactionMode: InteractionMode;
  setInteractionMode: (mode: InteractionMode) => void;

  // Shapes
  shapes: Shape[];
  setShapes: (updater: Shape[] | ((prev: Shape[]) => Shape[])) => void;

  // Selection
  selectedShape: Shape | null;
  setSelectedShape: (shape: Shape | null) => void;

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
  setPanOffset: (offset: Point) => void;

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
