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

import { ActivityItem, Board, NavItem, Template } from "./types";

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

export const BOARDS: Board[] = [
  {
    id: "1",
    title: "Orbit product planning",
    project: "Product",
    updated: "12 min ago",
    favorite: true,
    kind: "flow",
    people: ["MN", "JK", "AL"],
  },
  {
    id: "2",
    title: "Customer journey map",
    project: "Research",
    updated: "Yesterday",
    favorite: true,
    kind: "map",
    people: ["AL", "RF"],
  },
  {
    id: "3",
    title: "Q3 campaign concepts",
    project: "Marketing",
    updated: "Mon",
    favorite: false,
    kind: "notes",
    people: ["JK", "MN"],
  },
  {
    id: "4",
    title: "Mobile onboarding",
    project: "Design",
    updated: "Jul 9",
    favorite: false,
    kind: "wireframe",
    people: ["RF", "AL"],
  },
  {
    id: "5",
    title: "Team retrospective",
    project: "People",
    updated: "Jul 7",
    favorite: false,
    kind: "notes",
    people: ["MN", "RF", "JK"],
  },
  {
    id: "6",
    title: "Platform architecture",
    project: "Engineering",
    updated: "Jul 3",
    favorite: true,
    kind: "flow",
    people: ["JK", "RF"],
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
