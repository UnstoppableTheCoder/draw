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

import { useImageManager } from "../../interactions/manager/image-manager";
import { ImageShape } from "../../types";

export const drawImage = (
  ctx: CanvasRenderingContext2D,
  shape: ImageShape,
  imageManager: ReturnType<typeof useImageManager>,
) => {
  const {
    x,
    y,
    width,
    height,
    appearance: { opacity },
    data: { imageId },
  } = shape;

  const cached = imageManager.get(imageId);

  if (!cached || cached.status !== "loaded") {
    return;
  }

  ctx.save();
  ctx.globalAlpha = opacity / 100;

  ctx.drawImage(cached.image, x, y, width, height);

  ctx.restore();
};
