"use client";

import { useRef } from "react";
import TextEditor from "./text-editor";
import useCanvasResize from "../../renderer/use-canvas-resize";
import ZoomControllers from "./zoom-controllers";
import useImageUpload from "../../interactions/image/use-image-upload";
import { UndoRedo } from "./undo-redo";
import useEditorShortcuts from "../../interactions/shortcuts/use-editor-shortcuts";
import FrameNameEditor from "./frame-name-editor";
import useFrameNameEditor from "../../interactions/frame/use-frame-name-editor";
import { ContextMenu } from "./context-menu/context-menu";
import { EditorRefs } from "@/features/editor/types";
import useInteractionManager from "../../interactions/manager/use-interaction-manager";
import CanvasLayers from "./canvas-layers";
import useContextMenu from "./context-menu/use-context-menu";

type CanvasProps = {
  editor: EditorRefs;
};

const Canvas = ({ editor }: CanvasProps) => {
  const { sceneCanvasRef, overlayCanvasRef, pointerRefs } = editor;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const frameNameInputRef = useRef<HTMLInputElement | null>(null);

  // UI
  const contextMenu = useContextMenu(overlayCanvasRef);
  const frameEditor = useFrameNameEditor(frameNameInputRef, overlayCanvasRef);

  // Interactions
  const interaction = useInteractionManager({
    ...editor,
    textareaRef,
  });

  // Assets
  const imageUpload = useImageUpload({
    ...editor,
    imageInputRef,
  });

  // Global Effects
  useCanvasResize({ ...editor });
  useEditorShortcuts(pointerRefs);

  return (
    <div
      className="relative overflow-hidden w-screen h-screen"
      style={{
        backgroundColor: "#1e1e1e",
      }}
    >
      <CanvasLayers
        editor={editor}
        interaction={interaction}
        onContextMenu={contextMenu.openContextMenu}
      />

      <TextEditor canvasRef={sceneCanvasRef} textareaRef={textareaRef} />

      <input
        ref={imageInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={imageUpload.handleImageInputChange}
      />

      <FrameNameEditor
        frameNameInputRef={frameNameInputRef}
        frameEditor={frameEditor}
      />

      <div className="absolute bottom-4 left-4 flex items-center space-x-4 z-3">
        <ZoomControllers sceneCanvasRef={sceneCanvasRef} />
        <UndoRedo />
      </div>

      <ContextMenu
        contextMenu={{ ...contextMenu, overlayCanvasRef, pointerRefs }}
      />
    </div>
  );
};

export default Canvas;
