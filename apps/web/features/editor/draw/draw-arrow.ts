import { ArrowShape, SelectedShapeBounds } from "../types/types";

// Canvas Coordinate System
// (0, 0) is at the top-left corner of the canvas.
// X increases as you move right.
// Y increases as you move down.

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  shape: ArrowShape,
  bounds?: SelectedShapeBounds,
) => {
  const { x, y, points } = shape;

  if (points.length < 2) return;

  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";

  ctx.beginPath();

  const first = points[0];
  if (!first) return;

  ctx.moveTo(x + first[0], y + first[1]);

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (!point) continue;

    ctx.lineTo(x + point[0], y + point[1]);
  }

  // Steps:
  // 1. Find the last two points
  // 2. Compute the direction vector of the last segment
  // 3. Compute the segment's angle
  // 4. Compute the arrowhead wing coordinates

  const secondLast = points[points.length - 2];
  const last = points[points.length - 1];

  if (!secondLast || !last) return;

  const startX = x + secondLast[0];
  const startY = y + secondLast[1];

  const endX = x + last[0];
  const endY = y + last[1];

  // Direction vector of the last line segment
  const dx = endX - startX;
  const dy = endY - startY;

  // Angle of the last line segment relative to the positive X-axis.
  // atan2(dy, dx) returns an angle in radians in the range [-π, π].
  const angle = Math.atan2(dy, dx);
  const headLength = 16;

  // Arrowhead wing point:
  // x = endX - headLength * cos(wingAngle)
  // y = endY - headLength * sin(wingAngle)
  //
  // Based on Polar → Cartesian conversion:
  // x = centerX + radius * cos(angle)
  // y = centerY + radius * sin(angle)
  //
  // We use '-' instead of '+' because the wing is drawn
  // backwards from the arrow tip.

  // Lower wing when angle = 0 (arrow points right)
  const wing1X = endX - headLength * Math.cos(angle - Math.PI / 6);
  const wing1Y = endY - headLength * Math.sin(angle - Math.PI / 6);

  // Upper wing when angle = 0 (arrow points right)
  const wing2X = endX - headLength * Math.cos(angle + Math.PI / 6);
  const wing2Y = endY - headLength * Math.sin(angle + Math.PI / 6);

  ctx.moveTo(endX, endY);
  ctx.lineTo(wing1X, wing1Y);

  ctx.moveTo(endX, endY);
  ctx.lineTo(wing2X, wing2Y);

  ctx.stroke();
};
