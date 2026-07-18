import { Board } from "@/types/board";

interface BoardInfoProps {
  board: Board;
}

export default function BoardInfo({ board }: BoardInfoProps) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-medium">{board.name}</p>

      <p className="mt-1 text-xs text-muted-foreground">
        {board.name} · {board.updatedAt}
      </p>
    </div>
  );
}
