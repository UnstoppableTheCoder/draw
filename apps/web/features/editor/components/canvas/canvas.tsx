"use client";

import { useRef } from "react";
import TextEditor from "./text-editor";
import useCanvasResize from "../../hooks/canvas/use-canvas-resize";
import ZoomControllers from "./zoom-controllers";
import useTextEditing from "../../hooks/text/use-text-editing";
import useTextEditorResize from "../../hooks/text/use-text-editor-resize";
import useCanvasInteractions from "../../hooks/canvas/use-canvas-interactions";
import { usePointerState } from "../../hooks/pointer/use-pointer-state";
import useImageUpload from "../../hooks/tool/use-image-upload";
import { UndoRedo } from "./undo-redo";

const Canvas = () => {
  // Refs
  const sceneCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const pointerRefs = usePointerState();

  const canvasInteractions = useCanvasInteractions({
    sceneCanvasRef,
    overlayCanvasRef,
    pointerRefs,
  });
  const textEditing = useTextEditing(sceneCanvasRef, textareaRef);
  const { handleImageInputChange } = useImageUpload(
    sceneCanvasRef,
    imageInputRef,
  );
  useTextEditorResize(sceneCanvasRef, textareaRef); // Not in use - Instead used -> field-sizing-content in TextEditor
  useCanvasResize(sceneCanvasRef, overlayCanvasRef);

  return (
    <div
      onPointerDown={textEditing.handleParentPointerDown}
      className="relative overflow-hidden w-screen h-screen"
    >
      <canvas
        ref={sceneCanvasRef}
        className="absolute inset-0"
        style={{
          backgroundColor: "#000",
          zIndex: 0,
        }}
      />

      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0"
        style={{
          zIndex: 1,
        }}
        onPointerDown={canvasInteractions.handlePointerDown}
        onPointerMove={canvasInteractions.handlePointerMove}
        onPointerUp={canvasInteractions.handlePointerUp}
        onDoubleClick={textEditing.handleDoubleClick}
      />

      <TextEditor
        canvasRef={sceneCanvasRef}
        textareaRef={textareaRef}
        onKeyDown={textEditing.handleKeyDown}
      />

      <input
        ref={imageInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleImageInputChange}
      />

      <div className="absolute z-50 bottom-4 left-4 flex items-center space-x-4">
        <ZoomControllers canvasRef={sceneCanvasRef} />
        <UndoRedo />
      </div>
    </div>
  );
};

export default Canvas;
