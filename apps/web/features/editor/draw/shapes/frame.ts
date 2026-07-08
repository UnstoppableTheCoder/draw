import { TOLERANCE } from "../../constants/canvas";
import { FrameShape } from "../../types/types";

export const drawFrame = (
  ctx: CanvasRenderingContext2D,
  shape: FrameShape,
  scale: number,
  hovered: boolean,
) => {
  const { x, y, width, height, text } = shape;

  const borderColor = hovered ? "#6965DB" : "#7d7d7d";

  ctx.save();

  // Frame
  ctx.beginPath();
  ctx.lineWidth = (shape.strokeWidth ?? 2) / scale;
  ctx.strokeStyle = borderColor;

  ctx.roundRect(x, y, width, height, shape.roundness ?? 10);

  ctx.stroke();

  // Frame title
  ctx.font = `${text.fontSize / scale}px ${text.fontFamily}`;
  ctx.fillStyle = "#7d7d7d";
  ctx.textBaseline = "bottom";

  ctx.fillText(text.name, x, y - TOLERANCE / scale);

  // Debug bounds (remove later)
  ctx.strokeStyle = "#7d7d7d";
  ctx.strokeRect(x, y, text.width / scale, -text.height / scale - TOLERANCE / scale);

  ctx.restore();
};
