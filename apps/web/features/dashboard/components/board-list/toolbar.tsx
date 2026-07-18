import { BoardFilter } from "./filter";
import ViewSwitcher from "./view-switcher";

interface BoardToolbarProps {
  filter: "recent" | "favorites";
  onFilterChange: (filter: "recent" | "favorites") => void;
  listView: boolean;
  onListViewChange: (value: boolean) => void;
}

export default function BoardToolbar({
  filter,
  onFilterChange,
  listView,
  onListViewChange,
}: BoardToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <BoardFilter filter={filter} onChange={onFilterChange} />
      <ViewSwitcher listView={listView} onChange={onListViewChange} />
    </div>
  );
}
