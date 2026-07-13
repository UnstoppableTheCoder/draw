import { Point } from "../types";

export const getSize = ({
  startPoint,
  endPoint,
}: {
  startPoint: Point;
  endPoint: Point;
}) => {
  return {
    width: endPoint.x - startPoint.x,
    height: endPoint.y - startPoint.y,
  };
};
