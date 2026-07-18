import { axiosClient } from "@/config/axios";
import { ImageAsset, Shape } from "../../types";

type GetShapesResponse = {
  page: {
    shapes: Shape[];
  };
  imageAssets: ImageAsset;
};

type CreateShapesResponse = {
  shapes: Shape[];
};

type updateShapeResponse = {
  shapes: Shape[];
};

export const createShapes = async (
  pageId: string,
  shapes: Shape[],
): Promise<CreateShapesResponse> => {
  const { data } = await axiosClient.post<CreateShapesResponse>(
    `/pages/${pageId}/shapes`,
    { shapes },
  );

  return data;
};

export const getShapes = async (pageId: string): Promise<GetShapesResponse> => {
  const { data } = await axiosClient.get<GetShapesResponse>(
    `/pages/${pageId}/shapes`,
  );

  return data;
};

export const updateShapes = async (
  pageId: string,
  shapes: Shape[],
): Promise<updateShapeResponse> => {
  const { data } = await axiosClient.patch<updateShapeResponse>(
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
