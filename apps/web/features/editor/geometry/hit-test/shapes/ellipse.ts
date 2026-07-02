import { TOLERANCE } from "@/features/editor/constants/canvas";
import { EllipseShape } from "@/features/editor/types/types";
import { Point } from "@/types/canvas.types";

export const pointInEllipse = (
  point: Point,
  shape: EllipseShape,
  tolerance?: number,
): EllipseShape | null => {
  const radiusX = shape.width / 2;
  const radiusY = shape.height / 2;

  const centerX = shape.x + radiusX;
  const centerY = shape.y + radiusY;

  // Distance vector point and center
  const dx = point.x - centerX;
  const dy = point.y - centerY;

  // Equation of an Ellipse -> (x - cx)^2 / a^2 + (y - cy)^2 / b^2 <= 1
  // (x, y) -> point, (cx, cy) -> center, (a, b) -> radius (rx, ry)
  const inside =
    (dx * dx) / (radiusX + (tolerance ?? TOLERANCE)) ** 2 +
      (dy * dy) / (radiusY + (tolerance ?? TOLERANCE)) ** 2 <=
    1;

  return inside ? shape : null;
};
