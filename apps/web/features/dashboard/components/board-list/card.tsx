// features/dashboard/components/board-card.tsx

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import BoardInfo from "./info";
import { BoardActions } from "./actions";
import { Preview } from "../preview";
import { Board } from "@/types/board";
import { getBoard } from "@/features/board/api/board-api";
import { useSetPages } from "@/features/page/store/selectors";
import { useSetImages } from "@/features/editor/store/editor/selectors";
import { useRouter } from "next/navigation";

interface BoardCardProps {
  board: Board;
  listView: boolean;
}

export function BoardCard({ board, listView }: BoardCardProps) {
  const setPages = useSetPages();
  const setImages = useSetImages();
  const router = useRouter();

  const handleBoardCardClick = async (boardId: string) => {
    const { board, pages, imageAssets, members } = await getBoard(boardId);

    // setPages(pages);
    setImages(imageAssets);

    router.push(`/board/${board.id}/${pages[0]!.id}`);
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
