import { ImageShape } from "../../types/types";

const imageCache = new Map<string, HTMLImageElement>();

export const getCachedImage = (imageUrl: string) => {
  let img = imageCache.get(imageUrl);

  if (!img) {
    img = new Image();
    img.src = imageUrl;

    imageCache.set(imageUrl, img);
  }

  return img;
};

export const drawImage = (ctx: CanvasRenderingContext2D, shape: ImageShape) => {
  let img = imageCache.get(shape.imageUrl);

  if (!img) {
    img = new Image();
    img.src = shape.imageUrl;
    imageCache.set(shape.imageUrl, img);
  }

  ctx.save();
  ctx.globalAlpha = (shape.opacity ?? 100) / 100;
  ctx.drawImage(img, shape.x, shape.y, shape.width, shape.height);
  ctx.restore();
};
