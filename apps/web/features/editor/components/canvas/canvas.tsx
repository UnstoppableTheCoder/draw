"use client";

import { useRef } from "react";
import TextEditor from "./text-editor";
import useImageUpload from "../../hooks/use-image-upload";
import useCanvasInteractions from "../../hooks/use-canvas-interactions";
import useCanvasSize from "../../hooks/use-canvas-resize";
import ZoomControllers from "../zoom-controllers/zoom-controllers";
import useTextEditing from "../../hooks/use-text-editing";
import useTextEditorResize from "../../hooks/use-text-editor-resize";
import useCanvasResize from "../../hooks/use-canvas-resize";

const Canvas = () => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const canvasParentDivRef = useRef<HTMLDivElement | null>(null);

  // Hooks
  // const { shapes, setShapes } = useShapes();
  // const { handlePanMove } = usePan();
  // const { resizeShape } = useShapeResize();
  // const { moveShape } = useShapeMove();
  // const { handlePointerDown, handlePointerMove, handlePointerUp } =
  //   useCanvasDrawing({
  //     canvasRef,
  //     shapes,
  //     setShapes,
  //     setTextEditingState,
  //     selectedTool,
  //     panOffset,
  //     scale,
  //     scaleOffset,
  //   });
  const canvasInteractions = useCanvasInteractions({ canvasRef });
  const { handleKeyDown } = useTextEditing(canvasRef, textareaRef);
  const { handleImageInputChange } = useImageUpload(canvasRef, imageInputRef);

  useTextEditorResize(canvasRef, textareaRef);
  useCanvasResize(canvasRef);

  return (
    <div ref={canvasParentDivRef}>
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
