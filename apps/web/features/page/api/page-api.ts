import { axiosClient } from "@/config/axios";
import { CreatePagePayload, Page, UpdatePagePayload } from "../types";
import { ImageAsset, Shape } from "@/features/editor/types";

type CreatePageResponse = {
  page: Page;
};

type GetPageResponse = {
  page: Page & { shapes: Shape[] };
  imageAssets: Record<string, ImageAsset>;
};

type GetPagesResponse = {
  pages: Page[];
};

type UpdatePageResponse = {
  page: Page;
};

type DuplicatePageResponse = {
  page: Page;
};

type MovePageResponse = {
  page: Page;
};

export const getPageApi = async (pageId: string) => {
  const { data } = await axiosClient.get<GetPageResponse>(`pages/${pageId}`);

  return data;
};

export const getPagesApi = async (boardId: string) => {
  const { data } = await axiosClient.get<GetPagesResponse>(
    `/boards/${boardId}/pages`,
  );

  return data;
};

export const createPageApi = async (payload: CreatePagePayload) => {
  const { data } = await axiosClient.post<CreatePageResponse>(
    `/boards/${payload.boardId}/pages`,
    {
      name: payload.name,
      // icon: payload.icon,
      orderKey: "",
      createdById: payload.createdById,
    },
  );

  return data;
};

export const updatePageApi = async (
  pageId: string,
  payload: UpdatePagePayload,
): Promise<UpdatePageResponse> => {
  const { data } = await axiosClient.patch<UpdatePageResponse>(
    `/pages/${pageId}`,
    payload,
  );

  return data;
};

export const deletePageApi = async (pageId: string) => {
  await axiosClient.delete(`/pages/${pageId}`);
};

export const reorderPages = async (
  boardId: string,
  pages: {
    id: string;
    position: number;
  }[],
) => {
  await axiosClient.patch(`/boards/${boardId}/pages/reorder`, {
    pages,
  });
};

export const duplicatePageApi = async (
  pageId: string,
): Promise<DuplicatePageResponse> => {
  const { data } = await axiosClient.post<DuplicatePageResponse>(
    `/pages/${pageId}/duplicate`,
  );

  return data;
};

export const movePageApi = async (
  pageId: string,
  boardId: string,
): Promise<MovePageResponse> => {
  const { data } = await axiosClient.patch<MovePageResponse>(
    `/pages/${pageId}/move`,
    {
      boardId,
    },
  );

  return data;
};
