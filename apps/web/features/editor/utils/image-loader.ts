import { MAX_IMAGE_SIZE } from "../constants/image";

export type ImageInfo = {
  imageUrl: string;
  width: number;
  height: number;
};

export const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = reject;

    img.src = url;
  });

export const loadImageInfos = async (files: FileList): Promise<ImageInfo[]> => {
  return Promise.all(
    Array.from(files).map(async (file) => {
      const imageUrl = URL.createObjectURL(file);

      const img = await loadImage(imageUrl);

      const ratio = Math.min(
        1,
        MAX_IMAGE_SIZE / Math.max(img.width, img.height),
      );

      return {
        imageUrl,
        width: img.width * ratio,
        height: img.height * ratio,
      };
    }),
  );
};
