import { SelectedBounds } from "../../types/types";

export default function drawGroupedShapeSelection(
  ctx: CanvasRenderingContext2D,
  bounds: SelectedBounds,
  scale: number,
) {
  const { minX, minY, maxX, maxY } = bounds;

  const width = maxX - minX;
  const height = maxY - minY;

  ctx.save();

  // Selection border
  ctx.setLineDash([10 / scale, 10 / scale]);
  ctx.strokeStyle = "#d1d1d1";
  ctx.lineWidth = 1 / scale;

  // Shape Selection Box
  ctx.strokeRect(minX, minY, width, height);

  ctx.restore();
}
