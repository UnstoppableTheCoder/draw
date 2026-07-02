import { TOLERANCE } from "@/features/editor/constants/canvas";
import { DiamondShape, Point } from "@/features/editor/types/types";

export const pointInDiamond = (
  point: Point,
  shape: DiamondShape,
  tolerance?: number,
): DiamondShape | null => {
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;

  const dx = Math.abs(point.x - centerX);
  const dy = Math.abs(point.y - centerY);

  const halfWidth = shape.width / 2;
  const halfHeight = shape.height / 2;

  // Formula
  const inside =
    dx / (halfWidth + (tolerance ?? TOLERANCE)) +
      dy / (halfHeight + (tolerance ?? TOLERANCE)) <=
    1;

  return inside ? shape : null;
};
