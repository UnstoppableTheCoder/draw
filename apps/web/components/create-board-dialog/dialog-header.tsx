import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DialogHeaderProps {
  onClose: () => void;
}

export default function DialogHeader({ onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 id="new-board-title" className="text-lg font-semibold">
        Create a new board
      </h2>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Close dialog"
        onClick={onClose}
      >
        <X />
      </Button>
    </div>
  );
}
