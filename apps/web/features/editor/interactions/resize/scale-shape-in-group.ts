import { TOLERANCE } from "../../constants/canvas";
import { Point, SelectedBounds, Shape } from "../../types/types";

export function getAdjustedGroupBounds(bounds: SelectedBounds) {
  return {
    minX: bounds.minX + TOLERANCE,
    minY: bounds.minY + TOLERANCE,
    maxX: bounds.maxX - TOLERANCE,
    maxY: bounds.maxY - TOLERANCE,
  };
}

export function getGroupScale(
  initialGroupBounds: SelectedBounds,
  rect: { x: number; y: number; width: number; height: number },
) {
  // Removes the tolerance
  const { maxX, minX, maxY, minY } = getAdjustedGroupBounds(initialGroupBounds);

  const oldWidth = maxX - minX;
  const oldHeight = maxY - minY;

  const newWidth = rect.width;
  const newHeight = rect.height;

  return {
    group: { maxX, minX, maxY, minY },
    scaleX: oldWidth === 0 ? 1 : newWidth / oldWidth,
    scaleY: oldHeight === 0 ? 1 : newHeight / oldHeight,
  };
}

export function scalePointInGroup(
  point: Point,
  initialGroupBounds: SelectedBounds,
  rect: { x: number; y: number; width: number; height: number },
  scale?: number,
) {
  const { group, scaleX, scaleY } = getGroupScale(initialGroupBounds, rect);

  return {
    x: rect.x + (point.x - group.minX) * (scale ?? scaleX),
    y: rect.y + (point.y - group.minY) * (scale ?? scaleY),
  };
}

export function getScaledShapeRect(
  initialShape: Shape,
  initialGroupBounds: SelectedBounds,
  rect: { x: number; y: number; width: number; height: number },
  scale?: number,
) {
  const { group, scaleX, scaleY } = getGroupScale(initialGroupBounds, rect);

  const width = initialShape.width ?? 0;
  const height = initialShape.height ?? 0;

  return {
    x: rect.x + (initialShape.x - group.minX) * (scale ?? scaleX),
    y: rect.y + (initialShape.y - group.minY) * (scale ?? scaleY),
    width: width * (scale ?? scaleX),
    height: height * (scale ?? scaleY),
  };
}

export function getShapeBounds(shape: Shape): SelectedBounds {
  const width = shape.width ?? 0;
  const height = shape.height ?? 0;

  return {
    minX: shape.x,
    minY: shape.y,
    maxX: shape.x + width,
    maxY: shape.y + height,
  };
}
