type Dimensions = {
  width: number;
  height: number;
};

export default function getTextDimensions({
  ctx,
  text,
  fontSize,
  fontFamily,
}: {
  ctx: CanvasRenderingContext2D;
  text: string;
  fontSize: number;
  fontFamily: string;
}): Dimensions {
  // font -> "20 Arial"
  ctx.font = `${fontSize}px ${fontFamily}`;

  const lines = text.split("\n");
  const width = Math.max(...lines.map((line) => ctx.measureText(line).width));

  const totalHeight = lines.length * fontSize * 1.2;
  return { width, height: totalHeight };
}
