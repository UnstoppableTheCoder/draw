import { TOLERANCE } from "@/features/editor/constants/canvas";
import { DiamondShape, Point } from "@/features/editor/types";

export const pointInDiamond = (
  point: Point,
  shape: DiamondShape,
  scale: number,
  tolerance?: number,
): DiamondShape | null => {
  const scaledTolerance = (tolerance ?? TOLERANCE) / scale;

  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;

  const dx = Math.abs(point.x - centerX);
  const dy = Math.abs(point.y - centerY);

  const halfWidth = shape.width / 2;
  const halfHeight = shape.height / 2;

  // Formula
  const inside =
    dx / (halfWidth + scaledTolerance) + dy / (halfHeight + scaledTolerance) <=
    1;

  return inside ? shape : null;
};
