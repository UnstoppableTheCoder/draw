import { Point } from "@/features/editor/types";

type DrawGridProps = {
  ctx: CanvasRenderingContext2D;
  topLeft: Point;
  bottomRight: Point;
  scale: number;
};

export default function drawLineGrid({
  ctx,
  topLeft,
  bottomRight,
}: DrawGridProps) {
  const GRID_SIZE = 20;

  const startX = Math.floor(topLeft.x / GRID_SIZE) * GRID_SIZE;
  const startY = Math.floor(topLeft.y / GRID_SIZE) * GRID_SIZE;

  ctx.strokeStyle = "#2d2d2d";
  ctx.lineWidth = 1;

  ctx.beginPath();

  for (let x = startX; x <= bottomRight.x; x += GRID_SIZE) {
    ctx.moveTo(x, topLeft.y);
    ctx.lineTo(x, bottomRight.y);
  }

  for (let y = startY; y <= bottomRight.y; y += GRID_SIZE) {
    ctx.moveTo(topLeft.x, y);
    ctx.lineTo(bottomRight.x, y);
  }

  ctx.stroke();
}
