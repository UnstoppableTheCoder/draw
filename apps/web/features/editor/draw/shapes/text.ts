import { useShapePropertiesStore } from "../../store/properties/properties-store";
import { TextShape } from "../../types/types";

export const drawText = (ctx: CanvasRenderingContext2D, shape: TextShape) => {
  const {
    x,
    y,
    width,
    text,
    fontSize,
    fontFamily,
    strokeColor,
    textAlign = "left",
  } = shape;
  const { lineHeightMultiplier } = useShapePropertiesStore.getState();

  ctx.save();

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = strokeColor ?? "white";
  ctx.textBaseline = "top";
  ctx.globalAlpha = (shape.opacity ?? 100) / 100;
  ctx.textAlign = textAlign;

  const drawX =
    textAlign === "center"
      ? x + width! / 2
      : textAlign === "right"
        ? x + width!
        : x;

  const lineHeight = fontSize * (lineHeightMultiplier ?? 1.25);

  text.split("\n").forEach((line, index) => {
    ctx.fillText(line, drawX, y + index * lineHeight);
  });

  ctx.restore();
};
