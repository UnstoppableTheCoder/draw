import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { ImageAsset } from "../../types";

type Upload = {
  uploadUrl: string;
  publicUrl: string;
};

type UploadImageResponse = {
  success: boolean;
  uploads: Upload[];
};

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image."));
    image.src = src;
  });
}

export async function loadImageAssets(
  files: FileList,
  pageId: string,
  uploadedById: string,
): Promise<{
  assets: ImageAsset[];
  upload: Promise<ImageAsset[]>;
}> {
  const fileArray = Array.from(files);

  const assets = await Promise.all(
    fileArray.map(async (file) => {
      const renderUrl = URL.createObjectURL(file);
      const image = await loadImage(renderUrl);

      return {
        id: uuidv4(),
        renderUrl,
        pageId,
        uploadedById,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        status: "uploading" as const,
      };
    }),
  );

  const upload = (async () => {
    // Get presign url
    const { data } = await axios.post<UploadImageResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/presign`,
      {
        files: fileArray.map(({ name, type, size }) => ({
          name,
          type,
          size,
        })),
      },
    );

    return Promise.all(
      // Presign
      data.uploads.map(async ({ uploadUrl, publicUrl }, index) => {
        const file = fileArray[index]!;
        const asset = assets[index]!;

        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        URL.revokeObjectURL(asset.renderUrl);

        return {
          ...asset,
          publicUrl,
          renderUrl: "",
          status: "uploaded" as const,
        };
      }),
    );
  })();

  return {
    assets,
    upload,
  };
}
