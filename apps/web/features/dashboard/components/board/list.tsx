"use client";

import { cn } from "@/lib/utils";
import BoardToolbar from "./toolbar";
import { Board } from "../../types";
import { BoardCard } from "./card";

interface BoardListProps {
  boards: Board[];
  filter: "recent" | "favorites";
  onFilterChange: (filter: "recent" | "favorites") => void;
  listView: boolean;
  onListViewChange: (value: boolean) => void;
}

export function BoardList({
  boards,
  filter,
  onFilterChange,
  listView,
  onListViewChange,
}: BoardListProps) {
  return (
    <section>
      <BoardToolbar
        filter={filter}
        onFilterChange={onFilterChange}
        listView={listView}
        onListViewChange={onListViewChange}
      />

      <div
        className={cn(
          listView
            ? "flex flex-col gap-2"
            : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} listView={listView} />
        ))}
      </div>
    </section>
  );
}
