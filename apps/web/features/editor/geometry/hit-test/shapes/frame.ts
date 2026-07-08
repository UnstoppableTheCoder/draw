import { TOLERANCE } from "@/features/editor/constants/canvas";
import { FrameShape } from "@/features/editor/types/types";
import { Point } from "@/types/canvas.types";

export const pointInFrame = (
  point: Point,
  shape: FrameShape,
  tolerance?: number,
): FrameShape | null => {
  const inside =
    point.x >= shape.x - (tolerance ?? TOLERANCE) &&
    point.y >= shape.y - (tolerance ?? TOLERANCE) &&
    point.x <= shape.x + shape.width + (tolerance ?? TOLERANCE) &&
    point.y <= shape.y + shape.height + (tolerance ?? TOLERANCE);

  const text = shape.text;

  const insideText =
    point.x >= shape.x &&
    point.y <= shape.y &&
    point.x <= shape.x + text.width &&
    point.y >= shape.y - text.height - TOLERANCE;

  return inside || insideText ? shape : null;
};
