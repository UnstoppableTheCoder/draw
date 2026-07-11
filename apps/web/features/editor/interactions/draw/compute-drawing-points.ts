import { ToolType } from "@/types/toolbar";
import { PointTuple } from "../../types/types";

export const computeDrawingPoints = ({
  tool,
  relativePoint,
  currentPoints,
}: {
  tool: ToolType;
  relativePoint: PointTuple;
  currentPoints: PointTuple[];
}): PointTuple[] => {
  switch (tool) {
    case "freedraw":
      return [...currentPoints, relativePoint];

    case "line":
    case "arrow":
      return [[0, 0], relativePoint];

    default:
      return currentPoints;
  }
};
