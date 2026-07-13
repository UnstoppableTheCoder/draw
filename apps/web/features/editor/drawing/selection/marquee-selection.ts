import { normalizeRect } from "../../geometry/normalize-rect";

export default function drawMarqueeSelection(
  ctx: CanvasRenderingContext2D,
  marqueeSelection: { type: "selection-box" } & ReturnType<
    typeof normalizeRect
  >,
  scale: number,
) {
  if (!marqueeSelection) return;
  const { x, y, width, height } = marqueeSelection;

  ctx.save();

  ctx.setLineDash([4 / scale, 4 / scale]);
  ctx.lineWidth = 1 / scale;

  ctx.strokeStyle = "#a8a5ff";
  ctx.fillStyle = "rgba(168, 165, 255, 0.11)";

  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);

  ctx.restore();
}
