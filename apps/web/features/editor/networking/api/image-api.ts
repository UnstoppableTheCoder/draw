import { axiosClient } from "@/config/axios";
import { ImageAsset } from "../../types";

export const getImageAssets = async (
  boardId: string,
): Promise<ImageAsset[]> => {
  const { data } = await axiosClient.get<ImageAsset[]>(
    `/boards/${boardId}/image-assets`,
  );

  return data;
};

export const createImageAssets = async (
  boardId: string,
  imageAssets: ImageAsset[],
): Promise<ImageAsset[]> => {
  const { data } = await axiosClient.post<ImageAsset[]>(
    `/boards/${boardId}/image-assets`,
    imageAssets,
  );

  return data;
};

export const updateImageAssets = async (
  boardId: string,
  imageAssets: ImageAsset[],
): Promise<ImageAsset[]> => {
  const { data } = await axiosClient.patch<ImageAsset[]>(
    `/boards/${boardId}/image-assets`,
    imageAssets,
  );

  return data;
};

export const deleteImageAssets = async (
  boardId: string,
  ids: string[],
): Promise<void> => {
  await axiosClient.delete(`/boards/${boardId}/image-assets`, {
    data: {
      ids,
    },
  });
};
