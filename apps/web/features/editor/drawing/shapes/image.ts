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
  const {
    x,
    y,
    width,
    height,
    appearance: { opacity },
    data: { imageId },
  } = shape;

  const asset = images[imageId];
  if (!asset) return;

  const imageUrl = asset.renderUrl ?? asset.publicUrl;
  if (!imageUrl) return;

  const img = getCachedImage(imageUrl);

  if (!img.complete || img.naturalWidth === 0) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = opacity / 100;

  // if (crop) {
  //   ctx.drawImage(
  //     img,
  //     crop.x,
  //     crop.y,
  //     crop.width,
  //     crop.height,
  //     x,
  //     y,
  //     width,
  //     height,
  //   );
  // } else {
  //   ctx.drawImage(img, x, y, width, height);
  // }
  ctx.drawImage(img, x, y, width, height);

  ctx.restore();
};
