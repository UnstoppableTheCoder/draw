"use client";

import DialogHeader from "./dialog-header";
import { Board } from "@/types/board";
import DialogInput from "./dialog-input";

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type BoardPayload = Pick<
  Board,
  "name" | "description" | "thumbnail" | "favorite" | "isPublic" | "ownerId"
>;

export function CreateBoardDialog({
  open,
  onOpenChange,
}: CreateBoardDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-board-title"
      className="fixed inset-0 z-30 flex items-center justify-center bg-background/80 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader onClose={() => onOpenChange(false)} />
        <DialogInput />
      </div>
    </div>
  );
}
