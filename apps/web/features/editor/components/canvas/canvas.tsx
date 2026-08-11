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
import { useLoadPage } from "../../hooks/use-load-page";
import { useRef } from "react";
import { Loader } from "lucide-react";
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

  const { error, loading } = useLoadPage(imageManager);

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
      {/* Loader / Error Overlay */}
      {(loading || error) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e1e1e]/90 backdrop-blur-md text-white transition-all duration-300">
          {loading && !error && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-12 w-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <Loader className="animate-pulse text-indigo-400" size={24} />
              </div>
              <p className="text-sm font-medium tracking-wide text-zinc-400">
                Loading canvas...
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 max-w-md px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                <span className="text-xl font-bold">!</span>
              </div>
              <h3 className="text-base font-semibold text-zinc-200">
                Failed to load canvas
              </h3>
              <p className="text-xs text-red-400/90 bg-red-950/30 border border-red-900/40 rounded-lg p-3 w-full break-words">
                {error.message}
              </p>
            </div>
          )}
        </div>
      )}

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
          isSidebarOpen ? "left-72" : "left-5",
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
          imageManager
        }}
      />
    </div>
  );
};

export default Canvas;
