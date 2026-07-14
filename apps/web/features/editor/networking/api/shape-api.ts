import { axiosClient } from "@/config/axios";
import { Shape } from "../../types";

export const createShapes = async (
  pageId: string,
  shapes: Shape[],
): Promise<Shape[]> => {
  const { data } = await axiosClient.post<Shape[]>(
    `/pages/${pageId}/shapes`,
    shapes,
  );

  return data;
};

export const getShapes = async (pageId: string): Promise<Shape[]> => {
  const { data } = await axiosClient.get<Shape[]>(`/pages/${pageId}/shapes`);

  return data;
};

export const updateShapes = async (
  pageId: string,
  shapes: Shape[],
): Promise<Shape[]> => {
  const { data } = await axiosClient.patch<Shape[]>(
    `/pages/${pageId}/shapes`,
    shapes,
  );

  return data;
};

export const deleteShapes = async (
  pageId: string,
  ids: string[],
): Promise<void> => {
  await axiosClient.delete(`/pages/${pageId}/shapes`, {
    data: { ids },
  });
};
