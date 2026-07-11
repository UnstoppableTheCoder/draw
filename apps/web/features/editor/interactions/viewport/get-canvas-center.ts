type Point = {
  x: number;
  y: number;
};

export const getCanvasCenter = (
  canvas: HTMLCanvasElement,
  panOffset: Point,
  scale: number,
  scaleOffset: Point,
) => {
  const rect = canvas.getBoundingClientRect();

  // Convert viewport coordinates to canvas coordinates by:
  // 1. Removing canvas position (rect)
  // 2. Reversing zoom (scale & scaleOffset)
  // 3. Reversing pan offset
  return {
    centerX:
      (canvas.width / 2 - rect.left - scaleOffset.x) / scale - panOffset.x,
    centerY:
      (canvas.height / 2 - rect.top - scaleOffset.y) / scale - panOffset.y,
  };
};
