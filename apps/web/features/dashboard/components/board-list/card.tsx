"use client";

import { cn } from "@/lib/utils";
import BoardInfo from "./info";
import { BoardActions } from "./actions";
import { Board } from "@/types/board";
import { getBoard } from "@/features/board/api/board-api";
import { useRouter } from "next/navigation";

interface BoardCardProps {
  board: Board;
  listView: boolean;
}

export function BoardCard({ board, listView }: BoardCardProps) {
  const router = useRouter();

  const handleBoardCardClick = async (boardId: string) => {
    const { board, pages } = await getBoard(boardId);

    router.push(`/board/${board.id}/page/${pages[0]?.id}`);
  };

  return (
    <div
      onClick={() => handleBoardCardClick(board.id)}
      className={cn(
        "group overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary",
        listView && "flex items-center",
      )}
    >
      {/* {!listView && <Preview kind={board.kind} />} */}

      <div className="flex flex-1 items-center justify-between gap-3 p-4">
        <BoardInfo board={board} />
        <BoardActions board={board} />
      </div>
    </div>
  );
}
