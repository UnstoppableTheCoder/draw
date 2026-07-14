import { ImageAsset } from "./image";
import { Page } from "./page";

export interface Board {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: BoardRole;
  joinedAt: string; 
}


export interface GetBoardResponse {
  board: Board;
  pages: Page[];
  imageAssets: ImageAsset[];
}

export interface GetBoardsResponse {
  boards: Board[];
}

export interface GetBoardResponse {
  board: Board;
  pages: Page[];
  imageAssets: ImageAsset[];
  members: BoardMember[];
}

export enum BoardRole {
  OWNER = "OWNER",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}
