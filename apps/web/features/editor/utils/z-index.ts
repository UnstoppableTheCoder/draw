import { generateKeyBetween } from "fractional-indexing";
import { Shape } from "@/features/editor/types";

export function getNextZIndex(shapes: Shape[]) {
  const last = shapes.at(-1);
  return generateKeyBetween(last?.zIndex ?? null, null);
}

export function getPreviousZIndex(shapes: Shape[]) {
  const first = shapes[0];
  return generateKeyBetween(null, first?.zIndex ?? null);
}

export function getZIndexBetween(below: string | null, above: string | null) {
  return generateKeyBetween(below, above);
}
