import { ArrowShape, LineShape } from "../types/types";
import { getAbsolutePoint } from "../utils/get-absolute-point";

export default function drawLineSelection(
  ctx: CanvasRenderingContext2D,
  scale: number,
  selectedShape: ArrowShape | LineShape | null,
) {
  if (!selectedShape) return;
  const { x, y, points } = selectedShape;
  const handleRadius = 5 / scale;

  const [start, end] = points.map((point) => getAbsolutePoint(x, y, point));
  if (!start || !end) return;

  const handles = [
    { x: start.x, y: start.y }, // start
    {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    }, // midpoint
    { x: end.x, y: end.y }, // end
  ];

  ctx.save();

  ctx.strokeStyle = "#6965DB";
  ctx.fillStyle = "#FFFFFF";
  ctx.lineWidth = 1 / scale;

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  handles.forEach(({ x, y }) => {
    ctx.beginPath();

    ctx.arc(x, y, handleRadius, 0, Math.PI * 2);

    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
}
