import { ListEnd } from "lucide-react";
import { useShapePropertiesStore } from "../../store/properties/properties-store";
import { TextShape } from "../../types";

export const drawText = (ctx: CanvasRenderingContext2D, shape: TextShape) => {
  const {
    x,
    y,
    width,
    appearance: { strokeColor, opacity },
    data: { text, fontSize, fontFamily, textAlign = "left" },
  } = shape;

  const { lineHeightMultiplier } = useShapePropertiesStore.getState();

  ctx.save();

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = strokeColor;
  ctx.textBaseline = "top";
  ctx.globalAlpha = opacity / 100;
  ctx.textAlign = textAlign;

  const drawX =
    textAlign === "center"
      ? x + width / 2
      : textAlign === "right"
        ? x + width
        : x;

  const computedLineHeight = fontSize * lineHeightMultiplier;

  text.split("\n").forEach((line, index) => {
    ctx.fillText(line, drawX, y + index * computedLineHeight);
  });

  ctx.restore();
};
