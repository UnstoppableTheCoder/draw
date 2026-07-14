import { Button } from "@/features/editor/components/ui/button";
import { Bell, X } from "lucide-react";

interface NotificationsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Notifications({
  open,
  onOpenChange,
}: NotificationsProps) {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        onClick={() => onOpenChange(!open)}
      >
        <Bell />
      </Button>

      <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />

      {open && (
        <div className="absolute right-0 top-12 z-30 w-80 rounded-xl border bg-popover p-3 shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Notifications</p>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="mt-3 rounded-lg bg-secondary p-3 text-xs">
            <strong>Maya mentioned you</strong>

            <p className="mt-1 text-muted-foreground">
              In Orbit product planning · 6 min ago
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
