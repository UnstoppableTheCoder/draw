import { Point } from "@/features/editor/types";

type DrawGridProps = {
  ctx: CanvasRenderingContext2D;
  topLeft: Point;
  bottomRight: Point;
  scale: number;
};

export default function drawDotGrid({
  ctx,
  topLeft,
  bottomRight,
  scale,
}: DrawGridProps) {
  const GRID_SIZE = 30;

  const zoomFactor = Math.sqrt(scale);
  const spacing = GRID_SIZE / zoomFactor;

  const startX = Math.floor(topLeft.x / spacing) * spacing;
  const startY = Math.floor(topLeft.y / spacing) * spacing;

  ctx.fillStyle = "#3f3f46";

  const radius = 1.25 / scale;

  for (let x = startX; x <= bottomRight.x; x += spacing) {
    for (let y = startY; y <= bottomRight.y; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
