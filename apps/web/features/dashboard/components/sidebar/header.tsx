import { Button } from "@/features/editor/components/ui/button";
import { Logo } from "../logo";
import { Menu, PanelLeftClose } from "lucide-react";

interface SidebarHeaderProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function SidebarHeader({
  collapsed,
  onCollapsedChange,
}: SidebarHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b px-4">
      {!collapsed && <Logo />}

      <Button
        variant="ghost"
        size="icon"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => onCollapsedChange(!collapsed)}
      >
        {collapsed ? <Menu /> : <PanelLeftClose />}
      </Button>
    </div>
  );
}
