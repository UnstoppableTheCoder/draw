// features/dashboard/components/board-card.tsx

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import BoardInfo from "./info";
import { BoardActions } from "./actions";
import { Board } from "../../types";
import { Preview } from "../preview";

interface BoardCardProps {
  board: Board;
  listView: boolean;
}

export function BoardCard({ board, listView }: BoardCardProps) {
  return (
    <Link
      href="/whiteboard"
      className={cn(
        "group overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary",
        listView && "flex items-center",
      )}
    >
      {!listView && <Preview kind={board.kind} />}

      <div className="flex flex-1 items-center justify-between gap-3 p-4">
        <BoardInfo board={board} />
        <BoardActions board={board} />
      </div>
    </Link>
  );
}
