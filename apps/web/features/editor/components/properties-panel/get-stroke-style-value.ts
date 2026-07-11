import { StrokeStyle } from "../../types/types";

export default function getStrokeStyleValue(strokeStyle: StrokeStyle) {
  switch (strokeStyle) {
    case "solid":
      return [0, 0];

    case "dotted":
      return [5, 10];

    case "dashed":
      return [10, 10];

    default:
      return [0, 0];
  }
}
