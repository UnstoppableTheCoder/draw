import { Board } from "@/types/board";
import { Page } from "./page";

export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: BoardRole;
  joinedAt: string;
}

export interface GetBoardsResponse {
  boards: Board[];
}

export interface GetBoardResponse {
  board: Board;
  pages: Page[];
  members: BoardMember[];
}

export enum BoardRole {
  OWNER = "OWNER",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}
