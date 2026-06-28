import { TOLERANCE } from "../constants/canvas";
import { FreeDrawShape, PointTuple, SelectedShapeBounds } from "../types/types";

export function resizeFreeDrawShape({
  shape,
  rect,
  initialBounds,
  freeDrawPoints,
}: {
  shape: FreeDrawShape;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  initialBounds: SelectedShapeBounds;
  freeDrawPoints: PointTuple[];
}) {
  let { minX, minY, maxX, maxY } = initialBounds;

  minX += TOLERANCE;
  minY += TOLERANCE;
  maxX -= TOLERANCE;
  maxY -= TOLERANCE;

  const oldWidth = maxX - minX;
  const oldHeight = maxY - minY;

  const scaleX = oldWidth === 0 ? 1 : rect.width / oldWidth;
  const scaleY = oldHeight === 0 ? 1 : rect.height / oldHeight;

  let scaledPoints: PointTuple[] = freeDrawPoints.map(([px, py]) => [
    (px - minX) * scaleX + minX,
    (py - minY) * scaleY + minY,
  ]);

  let newMinX = Infinity;
  let newMinY = Infinity;

  for (const [px, py] of scaledPoints) {
    newMinX = Math.min(newMinX, px);
    newMinY = Math.min(newMinY, py);
  }

  scaledPoints = scaledPoints.map(([px, py]) => [px - newMinX, py - newMinY]);

  return {
    ...shape,
    x: rect.x,
    y: rect.y,
    points: scaledPoints,
  };
}
