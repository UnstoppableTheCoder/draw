import { cn } from "@/lib/utils";

interface BoardFilterProps {
  filter: "recent" | "favorites";

  onChange: (filter: "recent" | "favorites") => void;
}

export function BoardFilter({ filter, onChange }: BoardFilterProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
      <button
        onClick={() => onChange("recent")}
        className={cn(
          "rounded-md px-3 py-1.5 text-xs",
          filter === "recent" && "bg-card text-foreground shadow-sm",
        )}
      >
        Recent
      </button>

      <button
        onClick={() => onChange("favorites")}
        className={cn(
          "rounded-md px-3 py-1.5 text-xs",
          filter === "favorites" && "bg-card text-foreground shadow-sm",
        )}
      >
        Favorites
      </button>
    </div>
  );
}
