import { axiosClient } from "@/config/axios";
import { GetBoardResponse } from "../../editor/types/board";
import { Board } from "@/types/board";
import { BoardPayload } from "../../dashboard/components/create-board-dialog";
import { Page } from "../../editor/store/pages/types";

type CreateBoardResponse = {
  board: Board & { pages: Page[] };
};

type getBoardsResponse = {
  boards: Board[];
};

export const getBoards = async (): Promise<getBoardsResponse> => {
  const { data } = await axiosClient.get<getBoardsResponse>(`/boards`);
  return data;
};

export const getBoard = async (boardId: string): Promise<GetBoardResponse> => {
  const { data } = await axiosClient.get<GetBoardResponse>(
    `/boards/${boardId}`,
  );

  return data;
};

export const createBoard = async (
  board: BoardPayload,
): Promise<CreateBoardResponse> => {
  const { data } = await axiosClient.post<CreateBoardResponse>(
    "/boards",
    board,
  );

  return data;
};

export const updateBoard = async (
  boardId: string,
  board: Partial<BoardPayload>,
): Promise<Board> => {
  const { data } = await axiosClient.patch<Board>(`/boards/${boardId}`, board);

  return data;
};

export const deleteBoard = async (boardId: string): Promise<void> => {
  await axiosClient.delete(`/boards/${boardId}`);
};
