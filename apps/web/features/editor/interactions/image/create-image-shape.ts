import { ImageAsset, ImageShape, ShapeAppearance } from "../../types";
import { MAX_IMAGE_SIZE } from "../../constants/image";
import { createBaseShape, DEFAULT_APPEARANCE } from "../draw/create-shape";

export const createImageShape = (
  image: ImageAsset,
  zIndex: string,
  appearance?: Partial<ShapeAppearance>,
): ImageShape => {
  const ratio = Math.min(
    1,
    MAX_IMAGE_SIZE / Math.max(image.naturalWidth, image.naturalHeight),
  );

  const initialWidth = image.naturalWidth * ratio;
  const initialHeight = image.naturalHeight * ratio;

  const shapeAppearance: ShapeAppearance = {
    ...DEFAULT_APPEARANCE.image,
    ...appearance,
  };

  return createBaseShape(
    "image",
    {
      x: 0,
      y: 0,
      width: initialWidth,
      height: initialHeight,
    },
    {
      imageId: image.id,
      scale: [1, 1],
      crop: null,
    },
    shapeAppearance,
    zIndex,
  );
};
