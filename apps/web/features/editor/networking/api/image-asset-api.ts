import { axiosClient } from "@/config/axios";
import { ImageAsset } from "../../types";

export const getImageAssets = async (pageId: string): Promise<ImageAsset[]> => {
  const { data } = await axiosClient.get<ImageAsset[]>(
    `/pages/${pageId}/image-assets`,
  );

  return data;
};

export const createImageAssets = async (
  pageId: string,
  imageAssets: ImageAsset[],
): Promise<ImageAsset[]> => {
  const { data } = await axiosClient.post<ImageAsset[]>(
    `/pages/${pageId}/image-assets`,
    imageAssets,
  );

  return data;
};

export const updateImageAssets = async (
  pageId: string,
  imageAssets: ImageAsset[],
): Promise<ImageAsset[]> => {
  const { data } = await axiosClient.patch<ImageAsset[]>(
    `/pages/${pageId}/image-assets`,
    imageAssets,
  );

  return data;
};

export const deleteImageAssets = async (
  pageId: string,
  ids: string[],
): Promise<void> => {
  await axiosClient.delete(`/pages/${pageId}/image-assets`, {
    data: {
      ids,
    },
  });
};
