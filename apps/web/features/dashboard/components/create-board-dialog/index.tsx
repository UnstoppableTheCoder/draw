"use client";

import DialogHeader from "./dialog-header";
import DialogContent from "./dialog-content";
import DialogFooter from "./dialog-footer";

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader onClose={() => onOpenChange(false)} />
        <DialogContent />
        <DialogFooter onCancel={() => onOpenChange(false)} />
      </div>
    </div>
  );
}
