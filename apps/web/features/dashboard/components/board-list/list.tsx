"use client";

import { cn } from "@/lib/utils";

import BoardToolbar from "./toolbar";
import { BoardCard } from "./card";
import { useBoards } from "@/features/board/store/selectors";

interface BoardListProps {
  filter: "recent" | "favorites";
  onFilterChange: (filter: "recent" | "favorites") => void;
  listView: boolean;
  onListViewChange: (value: boolean) => void;
}

export function BoardList({
  filter,
  onFilterChange,
  listView,
  onListViewChange,
}: BoardListProps) {
  const boards = useBoards();

  const filteredBoards =
    filter === "favorites" ? boards.filter((board) => board.favorite) : boards;

  return (
    <section className="space-y-4">
      <BoardToolbar
        filter={filter}
        onFilterChange={onFilterChange}
        listView={listView}
        onListViewChange={onListViewChange}
      />

      {filteredBoards.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            {filter === "favorites"
              ? "No favorite boards found."
              : "No boards found."}
          </p>
        </div>
      ) : (
        <div
          className={cn(
            listView
              ? "flex flex-col gap-2"
              : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {filteredBoards.map((board, index) => (
            <BoardCard key={index} board={board} listView={listView} />
          ))}
        </div>
      )}
    </section>
  );
}
