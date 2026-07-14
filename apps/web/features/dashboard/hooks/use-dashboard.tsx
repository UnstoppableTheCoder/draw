import { useMemo, useState } from "react";

import { BOARDS } from "../data";

export function useDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"recent" | "favorites">("recent");
  const [listView, setListView] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);

  const boards = useMemo(() => {
    return BOARDS.filter((board) => {
      const matchesFilter = filter === "recent" || board.favorite;

      const matchesSearch = `${board.title} ${board.project}`
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [filter, query]);

  return {
    boards,
    collapsed,
    setCollapsed,
    query,
    setQuery,
    filter,
    setFilter,
    listView,
    setListView,
    notificationsOpen,
    setNotificationsOpen,
    createBoardOpen,
    setCreateBoardOpen,
  };
}
