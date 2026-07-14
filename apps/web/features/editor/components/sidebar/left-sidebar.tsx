import {
  LayoutGrid,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

function IconButton({
  label,
  children,
  active,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      aria-label={label}
      title={label}
      onClick={onClick}
      variant={active ? "default" : "ghost"}
      size="icon"
      className="shrink-0"
    >
      {children}
    </Button>
  );
}

const pages = ["Product map", "User journey", "Wireframes", "Notes & ideas"];

export default function LeftSidebar({
  activePage,
  setActivePage,
  onCollapse,
}: {
  activePage: number;
  setActivePage: (index: number) => void;
  onCollapse: () => void;
}) {
  return (
    <aside className="border-r flex flex-col w-56">
      <div className="flex flex-col border-b p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Board
          </span>
          <div className="flex items-center gap-1">
            <IconButton label="Collapse sidebar" onClick={onCollapse}>
              <PanelLeftClose className="size-4" />
            </IconButton>
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Orbit launch</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Product direction and launch planning.
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pages
          </span>
          <Search className="size-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          {pages.map((page, index) => (
            <button
              key={page}
              onClick={() => setActivePage(index)}
              className={cn(
                "group flex h-9 items-center gap-2 rounded-lg px-2 text-left text-sm transition-colors hover:bg-sidebar-accent",
                index === activePage &&
                  "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <LayoutGrid
                className={cn(
                  "size-4 text-muted-foreground",
                  index === activePage && "text-primary",
                )}
              />
              <span className="flex-1 truncate">{page}</span>
              {index === activePage && (
                <span className="size-1.5 rounded-full bg-primary" />
              )}
              <MoreHorizontal className="size-4 opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
      <div className="border-t p-3">
        <Button variant="ghost" className="w-full justify-start">
          <Plus data-icon="inline-start" />
          New page
        </Button>
      </div>
    </aside>
  );
}
