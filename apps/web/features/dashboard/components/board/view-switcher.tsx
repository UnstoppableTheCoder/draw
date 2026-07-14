import { Button } from "@/features/editor/components/ui/button";
import { Grid2X2, List } from "lucide-react";

interface ViewSwitcherProps {
  listView: boolean;

  onChange: (value: boolean) => void;
}

export default function ViewSwitcher({
  listView,
  onChange,
}: ViewSwitcherProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Grid view"
        onClick={() => onChange(false)}
      >
        <Grid2X2 />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label="List view"
        onClick={() => onChange(true)}
      >
        <List />
      </Button>
    </div>
  );
}
