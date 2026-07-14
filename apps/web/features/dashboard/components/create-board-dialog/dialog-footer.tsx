import { Button } from "@/features/editor/components/ui/button";
import Link from "next/link";

interface DialogFooterProps {
  onCancel: () => void;
}

export default function DialogFooter({ onCancel }: DialogFooterProps) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>

      <Button asChild>
        <Link href="/board">Create board</Link>
      </Button>
    </div>
  );
}
