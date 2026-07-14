"use client";

import { Redo2, Undo2 } from "lucide-react";
import useHistory from "../../interactions/history/use-history";
import CanvasButton from "./canvas-button";

export const UndoRedo = () => {
  const { canRedo, canUndo, undo, redo } = useHistory();

  return (
    <div className="flex items-center overflow-hidden rounded-xl border bg-white dark:bg-[#212121] shadow-sm">
      <CanvasButton disabled={!canUndo} onClick={undo} label="Undo">
        <Undo2 className="size-4" />
      </CanvasButton>

      <CanvasButton disabled={!canRedo} onClick={redo} label="Redo">
        <Redo2 className="size-4" />
      </CanvasButton>
    </div>
  );
};
