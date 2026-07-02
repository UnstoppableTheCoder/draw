import { TOLERANCE } from "../constants/canvas";
import { FreeDrawShape, PointTuple, SelectedBounds } from "../types/types";
import { scalePointInGroup } from "./scale-shape-in-group";

export function resizeFreeDrawShape({
  shape,
  rect,
  initialGroupBounds,
  freeDrawPoints,
}: {
  shape: FreeDrawShape;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  initialGroupBounds: SelectedBounds;
  freeDrawPoints: PointTuple[];
}) {
  // Absolute Points
  let scaledPoints: PointTuple[] = freeDrawPoints.map((point) => {
    const [px, py] = point;

    const scaledPoint = scalePointInGroup(
      { x: px, y: py },
      initialGroupBounds,
      rect,
    );

    return [scaledPoint.x, scaledPoint.y];
  });

  let newMinX = Infinity;
  let newMinY = Infinity;

  for (const [px, py] of scaledPoints) {
    newMinX = Math.min(newMinX, px);
    newMinY = Math.min(newMinY, py);
  }

  // Relative Distance Point
  scaledPoints = scaledPoints.map(([px, py]) => [px - newMinX, py - newMinY]);

  return {
    ...shape,
    x: newMinX,
    y: newMinY,
    points: scaledPoints,
  };
}
