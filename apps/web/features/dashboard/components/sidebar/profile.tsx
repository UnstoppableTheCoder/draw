import { Settings } from "lucide-react";
import Avatar from "../avatar";

interface SidebarProfileProps {
  collapsed: boolean;
}

export default function SidebarProfile({ collapsed }: SidebarProfileProps) {
  return (
    <div className="border-t p-2">
      <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent">
        <Avatar>RF</Avatar>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-medium">Riley Foster</p>

              <p className="truncate text-[10px] text-muted-foreground">
                Product team
              </p>
            </div>

            <Settings className="size-4 text-muted-foreground" />
          </>
        )}
      </button>
    </div>
  );
}
