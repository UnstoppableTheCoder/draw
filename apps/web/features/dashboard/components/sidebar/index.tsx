// features/dashboard/components/sidebar.tsx

"use client";

import { cn } from "@/lib/utils";
import { SidebarHeader } from "./header";
import { SidebarNavigation } from "./navigation";
import SidebarProfile from "./profile";

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r bg-sidebar transition-[width] md:flex",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <SidebarHeader
        collapsed={collapsed}
        onCollapsedChange={onCollapsedChange}
      />
      <SidebarNavigation collapsed={collapsed} />
      <SidebarProfile collapsed={collapsed} />
    </aside>
  );
}
