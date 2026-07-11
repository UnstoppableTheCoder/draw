import { Shape } from "../../types/types";

export function getGroupedShapes(previewShapes: Shape[]) {
  let groups: Record<string, Shape[]> = {};
  const groupedShapes = previewShapes.filter((shape) => shape.groupId);

  groupedShapes.forEach((shape) => {
    if (!shape.groupId) return;

    if (groups[shape.groupId]) {
      const groupedShapes = groups[shape.groupId];
      if (groupedShapes) {
        groupedShapes.push(shape);
      }
    } else {
      groups[shape.groupId] = [shape];
    }
  });

  return groups;
}
