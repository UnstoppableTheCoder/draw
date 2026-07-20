import { getBoards } from "@/features/board/api/board-api";
import { useSetBoards } from "@/features/board/store/selectors";
import { useEffect, useState } from "react";
import { Preview } from "../components/preview";

export function useDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"recent" | "favorites">("recent");
  const [listView, setListView] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const setBoards = useSetBoards();

  useEffect(() => {
    (async () => {
      const { boards } = await getBoards();
      setBoards(boards);
    })();
  }, []);

  return {
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
