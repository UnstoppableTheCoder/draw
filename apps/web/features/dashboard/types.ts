export interface NavItem {
  label: string;
  icon: React.ElementType;
}

export interface ActivityItem {
  id: string;
  avatar: string;
  title: string;
  board: string;
  time: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: "plus" | "grid" | "map" | "notes";
  href: string;
  enabled: boolean;
}
