"use client";

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
import { cn } from "@/lib/utils";
import { useLoadBoard } from "../../hooks/use-load-board";
import { useLoadPage } from "../../hooks/use-load-page";
import { useRef } from "react";
import { useImageManager } from "../../interactions/manager/image-manager";
import { useCanvasRenderer } from "../../context/use-renderer";
type CanvasProps = {
  editor: EditorRefs;
  isSidebarOpen: boolean;
};

const Canvas = ({ editor, isSidebarOpen }: CanvasProps) => {
  const { sceneCanvasRef, overlayCanvasRef, pointerRefs, imageManager } =
    editor;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const frameNameInputRef = useRef<HTMLInputElement | null>(null);

  useLoadBoard();
  useLoadPage(imageManager);

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
    imageManager,
  });

  useCanvasResize({ ...editor });
  useEditorShortcuts(pointerRefs);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#1e1e1e]">
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

      <div
        className={cn(
          "absolute bottom-4 z-40 flex items-center gap-4",
          isSidebarOpen ? "left-60" : "left-5",
        )}
      >
        <ZoomControllers sceneCanvasRef={sceneCanvasRef} />
        <UndoRedo />
      </div>

      <ContextMenu
        contextMenu={{
          ...contextMenu,
          overlayCanvasRef,
          pointerRefs,
        }}
      />
    </div>
  );
};

export default Canvas;
