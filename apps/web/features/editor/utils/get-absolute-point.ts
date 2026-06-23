export const getAbsolutePoint = (
  x: number,
  y: number,
  point: [number, number],
) => ({ x: x + point[0], y: y + point[1] });
