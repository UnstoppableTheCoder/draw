import { TOLERANCE } from "../../constants/canvas";
import { FrameShape } from "../../types";

export const drawFrame = (
  ctx: CanvasRenderingContext2D,
  shape: FrameShape,
  scale: number,
  hovered: boolean,
  isEditing: boolean,
) => {
  const {
    x,
    y,
    width,
    height,
    appearance: { roundness },
    data: { text },
  } = shape;

  // const isEditing =
  const borderColor = hovered ? "#6965DB" : "#7d7d7d";

  ctx.save();

  // Frame
  ctx.beginPath();
  ctx.lineWidth = 2 / scale;
  ctx.strokeStyle = borderColor;

  ctx.roundRect(x, y, width, height, roundness ?? 10);

  ctx.stroke();

  // Frame title
  if (!isEditing) {
    ctx.font = `${text.fontSize / scale}px ${text.fontFamily}`;
    ctx.fillStyle = "#7d7d7d";
    ctx.textBaseline = "bottom";

    ctx.fillText(text.name, x, y - TOLERANCE / scale);
  }

  ctx.restore();
};
