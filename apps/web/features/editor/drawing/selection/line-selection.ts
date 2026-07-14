import { getAbsolutePoint } from "../../geometry/get-absolute-point";
import { ArrowShape, LineShape } from "../../types";

export default function drawLineSelection(
  ctx: CanvasRenderingContext2D,
  scale: number,
  selectedShape: ArrowShape | LineShape | null,
  selectionType: "child" | "group" = "child",
  lineStyle: "solid" | "dashed",
) {
  if (!selectedShape) return;

  const {
    x,
    y,
    data: { points },
  } = selectedShape;

  const handleRadius = 5 / scale;

  const [start, end] = points.map((point) => getAbsolutePoint(x, y, point));

  if (!start || !end) return;

  const handles = [
    { x: start.x, y: start.y },
    {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    },
    { x: end.x, y: end.y },
  ];

  ctx.save();

  if (lineStyle === "dashed") {
    ctx.setLineDash([5, 5]);
  }

  ctx.strokeStyle = "#6965DB";
  ctx.fillStyle = "#FFFFFF";
  ctx.lineWidth = 1 / scale;

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  if (selectionType === "group") {
    for (const { x, y } of handles) {
      ctx.beginPath();
      ctx.arc(x, y, handleRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.restore();
}
