import { TOLERANCE } from "../../constants/canvas";
import { useEditorStore } from "../../store/editor/editor-store";
import { FrameShape } from "../../types/types";

export const drawFrame = (
  ctx: CanvasRenderingContext2D,
  shape: FrameShape,
  scale: number,
) => {
  const { x, y, width, height, text } = shape;
  const { isInsideFrame } = useEditorStore.getState();

  ctx.save();
  ctx.beginPath();

  ctx.lineWidth = (shape.strokeWidth ?? 2) / scale;
  ctx.strokeStyle = isInsideFrame ? "#6965DB" : "#7d7d7d";

  ctx.roundRect(x, y, width, height, shape.roundness ?? 10);
  ctx.stroke();

  ctx.closePath();
  ctx.restore();

  ctx.save();
  ctx.font = `${text.fontSize}px ${text.fontFamily}`;
  ctx.fillStyle = "#7d7d7d";
  ctx.textBaseline = "bottom";
  ctx.fillText(text.name, x, y - TOLERANCE);

  ctx.strokeStyle = "#7d7d7d";
  // Text Rectangle box -> todo:  Remove it later
  ctx.strokeRect(x, y, text.width, -text.height - TOLERANCE);
  ctx.stroke();

  ctx.restore();
};
