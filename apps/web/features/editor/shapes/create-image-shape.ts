import { v4 as uuidv4 } from "uuid";

import { ImageShape } from "../types/types";
import { ImageInfo } from "../utils/image-loader";

type Props = {
  image: ImageInfo;
  x: number;
  y: number;
};

export const createImageShape = ({ image, x, y }: Props): ImageShape => ({
  id: uuidv4(),
  type: "image",
  x,
  y,
  width: image.width,
  height: image.height,
  imageUrl: image.imageUrl,
});
