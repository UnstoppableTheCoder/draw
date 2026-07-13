import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { ImageAsset } from "../../types";

type Upload = {
  key: string;
  uploadUrl: string;
  publicUrl: string;
};

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image."));
    image.src = src;
  });
}

export async function loadImageAssets(files: FileList): Promise<{
  assets: ImageAsset[];
  upload: Promise<void>;
}> {
  const fileArray = Array.from(files);

  // Create local assets immediately
  const assets: ImageAsset[] = await Promise.all(
    fileArray.map(async (file) => {
      const blobUrl = URL.createObjectURL(file);
      const image = await loadImage(blobUrl);

      return {
        id: uuidv4(),
        renderUrl: blobUrl,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        status: "uploading" as const,
      };
    }),
  );

  // Upload in background
  const upload = (async () => {
    const { data } = await axios.post<{
      success: boolean;
      uploads: Upload[];
    }>(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/presign`, {
      files: fileArray.map(({ name, type, size }) => ({
        name,
        type,
        size,
      })),
    });

    await Promise.all(
      data.uploads.map(async ({ key, uploadUrl, publicUrl }, index) => {
        const file = fileArray[index]!;
        const asset = assets[index]!;

        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        asset.key = key;
        asset.publicUrl = publicUrl;
        asset.status = "uploaded";

        URL.revokeObjectURL(asset.renderUrl);
      }),
    );
  })();

  return {
    assets,
    upload,
  };
}
