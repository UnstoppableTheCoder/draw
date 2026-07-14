import { axiosClient } from "@/config/axios";

export interface PresignedFileRequest {
  name: string;
  type: string;
  size: number;
}

export interface PresignedFileResponse {
  id: string;
  key: string;
  uploadUrl: string;
  publicUrl: string;
}

export const generateUploadUrls = async (
  files: PresignedFileRequest[],
): Promise<PresignedFileResponse[]> => {
  const { data } = await axiosClient.post<PresignedFileResponse[]>(
    "/uploads/presigned-urls",
    {
      files,
    },
  );

  return data;
};

export const uploadFile = async (
  uploadUrl: string,
  file: File,
): Promise<void> => {
  await axiosClient.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};
