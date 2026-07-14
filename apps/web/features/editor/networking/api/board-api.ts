import { axiosClient } from "@/config/axios";
import { Board, GetBoardResponse } from "../../types/board";

export const getBoard = async (boardId: string): Promise<GetBoardResponse> => {
  const { data } = await axiosClient.get<GetBoardResponse>(
    `/boards/${boardId}`,
  );

  return data;
};

export const createBoard = async (board: Board): Promise<Board> => {
  const { data } = await axiosClient.post<Board>("/boards", board);

  return data;
};

export const updateBoard = async (
  boardId: string,
  board: Partial<Board>,
): Promise<Board> => {
  const { data } = await axiosClient.patch<Board>(`/boards/${boardId}`, board);

  return data;
};

export const deleteBoard = async (boardId: string): Promise<void> => {
  await axiosClient.delete(`/boards/${boardId}`);
};
