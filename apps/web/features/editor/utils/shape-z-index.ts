import { generateKeyBetween } from "fractional-indexing";

export function getNextZIndex(lastZIndex: string) {
  return generateKeyBetween(lastZIndex ?? null, null);
}

export function getPreviousZIndex(firstZIndex: string | null) {
  return generateKeyBetween(null, firstZIndex);
}

export function getZIndexBetween(below: string | null, above: string | null) {
  return generateKeyBetween(below, above);
}
