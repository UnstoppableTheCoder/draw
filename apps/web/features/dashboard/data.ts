// features/dashboard/data.ts

import {
  FileText,
  FolderKanban,
  Grid2X2,
  LayoutDashboard,
  MessageCircle,
  Phone,
  Star,
  Users,
} from "lucide-react";

import { ActivityItem, NavItem, Template } from "./types";
import { Board } from "@/types/board";

export const NAVIGATION: NavItem[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    label: "All boards",
    icon: Grid2X2,
  },
  {
    label: "Projects",
    icon: FolderKanban,
  },
  {
    label: "Shared with me",
    icon: Users,
  },
  {
    label: "Favorites",
    icon: Star,
  },
];

export const WORKSPACE_NAVIGATION: NavItem[] = [
  {
    label: "Messages",
    icon: MessageCircle,
  },
  {
    label: "Calls",
    icon: Phone,
  },
  {
    label: "Files",
    icon: FileText,
  },
];

export const TEMPLATES: Template[] = [
  {
    id: "blank",
    title: "Blank board",
    description: "A clean infinite canvas",
    icon: "plus",
    href: "/board",
    enabled: true,
  },
  {
    id: "kickoff",
    title: "Project kickoff",
    description: "Align goals and owners",
    icon: "grid",
    href: "#",
    enabled: false,
  },
  {
    id: "journey",
    title: "User journey",
    description: "Map customer touchpoints",
    icon: "map",
    href: "#",
    enabled: false,
  },
  {
    id: "brainstorm",
    title: "Brainstorm",
    description: "Capture ideas together",
    icon: "notes",
    href: "#",
    enabled: false,
  },
];

export const ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    avatar: "MN",
    title: "Maya added 4 frames",
    board: "Orbit product planning",
    time: "8 min",
  },
  {
    id: "2",
    avatar: "JK",
    title: "Jon shared a PDF",
    board: "Platform architecture",
    time: "31 min",
  },
  {
    id: "3",
    avatar: "AL",
    title: "Ari left 3 comments",
    board: "Customer journey map",
    time: "1 hr",
  },
];
