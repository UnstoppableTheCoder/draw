import { ToolType } from "@/features/editor/types/toolbar";
import {
  EraserPoint,
  FrameEditingState,
  Point,
  TextEditingState,
} from "../../types/types";
import { ImageAsset, Shape } from "../../types";

export type ImageMap = Record<string, ImageAsset>;

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

  // Images
  images: ImageMap;
  setImages: (updater: ImageMap | ((prev: ImageMap) => ImageMap)) => void;
  addImage: (image: ImageAsset) => void;
  removeImage: (imageId: string) => void;
  clearImages: () => void;

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
  clearHistory: () => void;

  // Frame
  hoveredFrameId: string | null;
  setHoveredFrameId: (
    updater: string | null | ((prev: string | null) => string | null),
  ) => void;

  frameEditingState: FrameEditingState | null;
  setFrameEditingState: (
    updater:
      | FrameEditingState
      | null
      | ((prev: FrameEditingState | null) => FrameEditingState | null),
  ) => void;
}
