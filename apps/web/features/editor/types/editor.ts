import { usePointerState } from "@/features/editor/pointer/use-pointer-state";
import { RefObject } from "react";
import { useImageManager } from "../interactions/manager/image-manager";

export type PointerRefs = ReturnType<typeof usePointerState>;

export interface EditorRefs {
  backgroundCanvasRef: RefObject<HTMLCanvasElement | null>;
  sceneCanvasRef: RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  pointerRefs: PointerRefs;
  imageManager: ReturnType<typeof useImageManager>;
}
