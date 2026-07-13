import { v4 as uuidv4 } from "uuid";

import { ImageAsset, ImageShape } from "../../types";
import { MAX_IMAGE_SIZE } from "../../constants/image";

export const createImageShape = (image: ImageAsset): ImageShape => {
  const ratio = Math.min(
    1,
    MAX_IMAGE_SIZE / Math.max(image.naturalWidth, image.naturalHeight),
  );

  const initialWidth = image.naturalWidth * ratio;
  const initialHeight = image.naturalHeight * ratio;

  return {
    id: uuidv4(),
    imageId: image.id,
    type: "image",
    x: 0,
    y: 0,
    width: initialWidth,
    height: initialHeight,
  };
};
