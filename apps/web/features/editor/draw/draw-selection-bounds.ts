import { SelectedShapeBounds } from "../types/types";

export default function drawSelectionBounds(
  ctx: CanvasRenderingContext2D,
  scale: number,
  bounds: SelectedShapeBounds,
) {
  const { minX, minY, maxX, maxY } = bounds;

  const handleSize = 8 / scale;
  const rotationHandleRadius = 5 / scale;
  const rotationHandleOffset = 24 / scale;

  const width = maxX - minX;
  const height = maxY - minY;

  const handles = [
    // corners
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: minX, y: maxY },
    { x: maxX, y: maxY },

    // edges - mid points
    { x: minX + width / 2, y: minY },
    { x: minX + width / 2, y: maxY },
    { x: minX, y: minY + height / 2 },
    { x: maxX, y: minY + height / 2 },
  ];

  const rotationX = minX + width / 2;
  const rotationY = minY - rotationHandleOffset;

  ctx.save();

  // Selection border
  ctx.strokeStyle = "#6965DB";
  ctx.lineWidth = 1 / scale;

  ctx.strokeRect(minX, minY, width, height);

  // Line connecting top-center handle to rotation handle
  ctx.beginPath();
  ctx.moveTo(minX + width / 2, minY);
  ctx.lineTo(rotationX, rotationY);
  ctx.stroke();

  // Rotation handle
  ctx.beginPath();
  ctx.arc(rotationX, rotationY, rotationHandleRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.stroke();

  // Resize handles
  handles.forEach(({ x, y }) => {
    ctx.fillStyle = "#FFFFFF";

    ctx.fillRect(
      x - handleSize / 2,
      y - handleSize / 2,
      handleSize,
      handleSize,
    );

    ctx.strokeRect(
      x - handleSize / 2,
      y - handleSize / 2,
      handleSize,
      handleSize,
    );
  });

  ctx.restore();
}
