import { NAVIGATION, WORKSPACE_NAVIGATION } from "../../data";
import NavigationItem from "./navigation-item";

interface SidebarNavigationProps {
  collapsed: boolean;
}

export function SidebarNavigation({ collapsed }: SidebarNavigationProps) {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-2">
      {NAVIGATION.map(({ label, icon: Icon }, index) => (
        <NavigationItem
          key={label}
          icon={Icon}
          label={label}
          collapsed={collapsed}
          active={index === 0}
        />
      ))}

      <div className="my-2 border-t" />

      {!collapsed && (
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
      )}

      {WORKSPACE_NAVIGATION.map(({ label, icon: Icon }) => (
        <NavigationItem
          key={label}
          icon={Icon}
          label={label}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
}
