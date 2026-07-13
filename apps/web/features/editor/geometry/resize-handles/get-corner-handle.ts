import { Point, SelectedBounds } from "../../types/types";
import { ResizeHandleType } from "../../types/resize-handle";

function isPointInsideRect({
  point,
  x,
  y,
  width,
  height,
}: {
  point: Point;
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return (
    point.x >= x &&
    point.x <= x + width &&
    point.y >= y &&
    point.y <= y + height
  );
}

export function getCornerHandle(
  point: Point,
  bounds: SelectedBounds,
  scale: number,
): ResizeHandleType {
  const handleSize = 8 / scale;
  const halfHandle = handleSize / 2;

  const { minX, minY, maxX, maxY } = bounds;

  const corners = [
    {
      type: "top-left" as const,
      x: minX,
      y: minY,
    },
    {
      type: "top-right" as const,
      x: maxX,
      y: minY,
    },
    {
      type: "bottom-left" as const,
      x: minX,
      y: maxY,
    },
    {
      type: "bottom-right" as const,
      x: maxX,
      y: maxY,
    },
  ];

  for (const corner of corners) {
    const isInside = isPointInsideRect({
      point,
      x: corner.x - halfHandle,
      y: corner.y - halfHandle,
      width: handleSize,
      height: handleSize,
    });

    if (isInside) {
      return corner.type;
    }
  }

  return null;
}
