import { ImageMap } from "../../store/editor/editor-types";
import { ImageShape } from "../../types";

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

export const drawImage = (
  ctx: CanvasRenderingContext2D,
  shape: ImageShape,
  images: ImageMap,
) => {
  const asset = images[shape.imageId];
  if (!asset) return;

  const imageUrl = asset.renderUrl ?? asset.publicUrl;
  if (!imageUrl) return;

  const img = getCachedImage(imageUrl);

  if (!img.complete || img.naturalWidth === 0) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = (shape.opacity ?? 100) / 100;

  ctx.drawImage(img, shape.x, shape.y, shape.width, shape.height);

  ctx.restore();
};
