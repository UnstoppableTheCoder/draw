import { Board } from "@/types/board";
import { ImageAsset } from "./image";
import { Page } from "./page";
import { ImageMap } from "../store/editor/editor-types";

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
  imageAssets: ImageMap;
  members: BoardMember[];
}

export enum BoardRole {
  OWNER = "OWNER",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}
