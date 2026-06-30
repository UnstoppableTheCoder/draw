"use client";

import { Redo2, Undo2 } from "lucide-react";
import { Button } from "../ui/button";
import useHistory from "../../hooks/history/use-history";

export const UndoRedo = () => {
  const { canRedo, canUndo, undo, redo } = useHistory();

  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        disabled={!canUndo}
        onClick={undo}
        className="w-10 cursor-pointer rounded-none border-r border-neutral-200 p-0 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Undo2 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        disabled={!canRedo}
        onClick={redo}
        className="w-10 cursor-pointer rounded-none p-0 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
