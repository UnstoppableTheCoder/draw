"use client";

import { useState } from "react";
import {
  ChevronRight,
  Copy,
  MoreHorizontal,
  Pencil,
  SquareArrowRight,
  Trash2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBoards } from "@/features/board/store/selectors";
import { Board } from "@/types/board";

interface PageActionsMenuProps {
  editingPageId: string | null;
  pageId: string;
  pageName: string;
  currentBoardId: string;
  onRename: (pageId: string, pageName: string) => void;
  onDuplicate: (pageId: string) => void;
  onMove: (pageId: string, targetBoardId: string) => void;
  onDelete: (pageId: string) => void;
}

export default function PageActionsMenu({
  editingPageId,
  pageId,
  pageName,
  currentBoardId,
  onRename,
  onDuplicate,
  onMove,
  onDelete,
}: PageActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);

  const boards: Board[] = useBoards();
  const otherBoards = boards.filter((b) => b.id !== currentBoardId);

  // Hide the More button on the row currently being renamed
  const isEditingThisRow = editingPageId === pageId;
  if (isEditingThisRow) return null;

  const close = () => {
    setMoveOpen(false);
    setOpen(false);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    close();
    onRename(pageId, pageName);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    close();
    onDuplicate(pageId);
  };

  const handleMove = (e: React.MouseEvent, targetBoardId: string) => {
    e.stopPropagation();
    close();
    onMove(pageId, targetBoardId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    close();
    onDelete(pageId);
  };

  const itemClass = cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
    "text-foreground hover:bg-muted focus:bg-muted focus:outline-none",
  );

  const dangerItemClass = cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
    "text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none",
    "dark:hover:bg-red-950/40 dark:focus:bg-red-950/40",
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Page actions"
          onClick={(e) => e.stopPropagation()}
          data-state={open ? "open" : "closed"}
          className={cn(
            "flex size-6 items-center justify-center rounded-md text-muted-foreground",
            "hover:bg-muted hover:text-foreground",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100",
          )}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="right"
        sideOffset={6}
        className="w-52 p-1"
        onClick={(e) => e.stopPropagation()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <button type="button" onClick={handleRename} className={itemClass}>
          <Pencil className="size-4" />
          Rename
        </button>

        <button type="button" onClick={handleDuplicate} className={itemClass}>
          <Copy className="size-4" />
          Duplicate
        </button>

        {/* Move to another board — nested popover */}
        <Popover open={moveOpen} onOpenChange={setMoveOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMoveOpen((v) => !v);
              }}
              className={cn(itemClass, "justify-between")}
              data-state={moveOpen ? "open" : "closed"}
            >
              <span className="flex items-center gap-2">
                <SquareArrowRight className="size-4" />
                Move to board
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            side="right"
            sideOffset={8}
            className="w-56 p-1"
            onClick={(e) => e.stopPropagation()}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {otherBoards.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No other boards
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {otherBoards.map((board) => (
                  <button
                    key={board.id}
                    type="button"
                    onClick={(e) => handleMove(e, board.id)}
                    className={itemClass}
                    title={board.name}
                  >
                    <span className="truncate">{board.name}</span>
                  </button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>

        <div className="my-1 h-px bg-border" />

        <button
          type="button"
          onClick={handleDelete}
          className={dangerItemClass}
        >
          <Trash2 className="size-4" />
          Delete page
        </button>
      </PopoverContent>
    </Popover>
  );
}
