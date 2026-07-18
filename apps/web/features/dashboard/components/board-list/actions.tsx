import { MoreHorizontal } from "lucide-react";
import Avatar from "../avatar";
import { Board } from "@/types/board";

interface BoardActionsProps {
  board: Board;
}

export function BoardActions({ board }: BoardActionsProps) {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {/* {board.people.slice(0, 2).map((person) => (
          <Avatar key={person}>{person}</Avatar>
        ))} */}
      </div>

      <MoreHorizontal className="ml-2 size-4 text-muted-foreground" />
    </div>
  );
}
