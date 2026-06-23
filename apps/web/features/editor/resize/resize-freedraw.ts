import { RefObject } from "react";
import { FreeDrawShape, PointTuple, SelectedShapeBounds } from "../types/types";
import { TOLERANCE } from "../constants/canvas";

export function resizeFreeDrawShape({
  selectedShape,
  rect,
  resizeStartBoundsRef,
  freeDrawShapePointsRef,
}: {
  selectedShape: FreeDrawShape;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  resizeStartBoundsRef: RefObject<SelectedShapeBounds | null>;
  freeDrawShapePointsRef: RefObject<PointTuple[]>;
}) {
  const originalBounds = resizeStartBoundsRef.current;
  if (!originalBounds) return;

  let { minX, minY, maxX, maxY } = originalBounds;

  // Removing the added Tolerance
  minX = minX + TOLERANCE;
  minY = minY + TOLERANCE;
  maxX = maxX - TOLERANCE;
  maxY = maxY - TOLERANCE;

  const originalPoints = freeDrawShapePointsRef.current;

  if (!originalPoints) {
    return selectedShape;
  }

  const oldWidth = maxX - minX;
  const oldHeight = maxY - minY;

  const newWidth = rect.width;
  const newHeight = rect.height;

  const scaleX = oldWidth === 0 ? 1 : newWidth / oldWidth;
  const scaleY = oldHeight === 0 ? 1 : newHeight / oldHeight;

  let scaledPoints: [number, number][] = originalPoints.map(([px, py]) => [
    (px - minX) * scaleX + minX,
    (py - minY) * scaleY + minY,
  ]);

  let newMinX = Infinity;
  let newMinY = Infinity;

  for (const [px, py] of scaledPoints) {
    newMinX = Math.min(newMinX, px);
    newMinY = Math.min(newMinY, py);
  }

  // It makes the points start with [0, 0]
  scaledPoints = scaledPoints.map(([px, py]) => {
    return [px - newMinX, py - newMinY];
  });

  return {
    ...selectedShape,
    x: rect.x,
    y: rect.y,
    points: scaledPoints,
  };
}
