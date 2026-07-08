import { ToolType } from "@/types/toolbar.types";
import {
  EraserPoint,
  Point,
  SelectedBounds,
  Shape,
  TextEditingState,
} from "../../types/types";

export type Group = {
  [groupId: string]: string[];
};

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
  selectedShapesIds: string[];
  setSelectedShapesIds: (
    updater: string[] | ((prev: string[]) => string[]),
  ) => void;

  selectionBounds: SelectedBounds | null;
  setSelectionBounds: (bounds: SelectedBounds | null) => void;

  selectedGroupsIds: string[];
  setSelectedGroupsIds: (
    updater: string[] | ((prev: string[]) => string[]),
  ) => void;

  // Add the types
  frames: any[];
  setFrames: (updater: any[] | ((prev: any[]) => any[])) => void;

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

  // Frame
  hoveredFrameId: string | null;
  setHoveredFrameId: (
    updater: string | null | ((prev: string | null) => string | null),
  ) => void;
}
