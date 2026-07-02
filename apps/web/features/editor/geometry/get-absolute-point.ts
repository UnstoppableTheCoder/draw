import { PointTuple } from "../types/types";

export const getAbsolutePoint = (x: number, y: number, point: PointTuple) => ({
  x: x + point[0],
  y: y + point[1],
});
