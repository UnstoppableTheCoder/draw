import { cn } from "@/lib/utils";

interface NavigationItemProps {
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
  active?: boolean;
}

export default function NavigationItem({
  label,
  icon: Icon,
  collapsed,
  active = false,
}: NavigationItemProps) {
  return (
    <button
      className={cn(
        "flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
        active && "bg-sidebar-accent text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />

      {!collapsed && <span>{label}</span>}
    </button>
  );
}
