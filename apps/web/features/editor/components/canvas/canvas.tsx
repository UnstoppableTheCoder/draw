"use client";

import { useEffect, useRef } from "react";
import TextEditor from "./text-editor";
import useImageUpload from "../../hooks/use-image-upload";
import useCanvasSize from "../../hooks/use-canvas-resize";
import ZoomControllers from "../zoom-controllers/zoom-controllers";
import useTextEditing from "../../hooks/use-text-editing";
import useTextEditorResize from "../../hooks/use-text-editor-resize";
import useCanvasDrawing from "../../hooks/use-canvas-drawing";
import {
  usePanOffset,
  useSelectedTool,
  useSetPanOffset,
} from "../../store/selectors";

const Canvas = () => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const selectedTool = useSelectedTool();
  const panOffset = usePanOffset();
  const setPanOffset = useSetPanOffset();

  const canvasInteractions = useCanvasDrawing(canvasRef);
  const { handleKeyDown, handleParentPointerDown } = useTextEditing(
    canvasRef,
    textareaRef,
  );
  const { handleImageInputChange } = useImageUpload(canvasRef, imageInputRef);
  useTextEditorResize(canvasRef, textareaRef);
  useCanvasSize(canvasRef);

  // Moves the page up and down and left and right
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;

      setPanOffset((prev) => ({
        x: prev.x - (e.shiftKey ? e.deltaY : e.deltaX),
        y: prev.y - (e.shiftKey ? e.deltaX : e.deltaY),
      }));
    };

    window.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [setPanOffset]);

  return (
    <div onPointerDown={handleParentPointerDown}>
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: "#2c2c2c" }}
        onPointerDown={canvasInteractions.handlePointerDown}
        onPointerMove={canvasInteractions.handlePointerMove}
        onPointerUp={canvasInteractions.handlePointerUp}
      ></canvas>

      <TextEditor textareaRef={textareaRef} onKeyDown={handleKeyDown} />

      <input
        ref={imageInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleImageInputChange}
      />

      {/* Undo & Redo */}
      <div className="absolute z-50 bottom-4 left-4 space-x-4 flex items-center">
        <ZoomControllers canvasRef={canvasRef} />
      </div>
    </div>
  );
};

export default Canvas;
