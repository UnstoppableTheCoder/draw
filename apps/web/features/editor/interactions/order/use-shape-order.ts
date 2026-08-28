import { generateKeyBetween, generateNKeysBetween } from "fractional-indexing";
import { useCanvasRenderer } from "../../context/use-renderer";
import {
  usePushHistory,
  useSelectedShapesIds,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { updateShapesApi } from "../../networking/api/shape-api";
import { Shape } from "../../types";
import { useParams } from "next/navigation";

function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareByZIndex(a: Shape, b: Shape): number {
  return compareStrings(a.zIndex, b.zIndex) || compareStrings(a.id, b.id);
}

export default function useShapeOrder() {
  const { pageId } = useParams<{ pageId: string }>();
  const shapes = useShapes();
  const setShapes = useSetShapes();
  const selectedShapeIds = useSelectedShapesIds();
  const pushHistory = usePushHistory();
  const { invalidate } = useCanvasRenderer();

  async function bringForward() {
    const previousShapes = shapes;
    const selected = new Set(selectedShapeIds);

    const groups = new Map<string | null, Shape[]>();

    for (const shape of shapes) {
      if (!selected.has(shape.id)) continue;

      const parent = shape.frameId ?? null;

      if (!groups.has(parent)) {
        groups.set(parent, []);
      }

      groups.get(parent)!.push(shape);
    }

    const updates = new Map<string, Shape>();

    for (const [parentFrameId, selectedShapes] of groups) {
      const siblings = shapes
        .filter((s) => (s.frameId ?? null) === parentFrameId)
        .sort(compareByZIndex);

      const selectedIds = new Set(selectedShapes.map((s) => s.id));

      const orderedSelected = siblings.filter((s) => selectedIds.has(s.id));

      if (!orderedSelected.length) continue;

      const last = orderedSelected.at(-1)!;
      const lastIndex = siblings.findIndex((s) => s.id === last.id);

      const next = siblings[lastIndex + 1];

      if (!next || selectedIds.has(next.id)) continue;

      const keys = generateNKeysBetween(
        next.zIndex,
        siblings[lastIndex + 2]?.zIndex ?? null,
        orderedSelected.length,
      );

      orderedSelected.forEach((shape, i) => {
        updates.set(shape.id, {
          ...shape,
          zIndex: keys[i]!,
        });
      });
    }

    if (!updates.size) return;

    const changedShapes = [...updates.values()];

    setShapes(
      shapes
        .map((shape) => updates.get(shape.id) ?? shape)
        .sort(compareByZIndex),
    );

    pushHistory();
    invalidate();

    try {
      await updateShapesApi(pageId, changedShapes);
    } catch {
      setShapes(previousShapes);
      invalidate();
    }
  }

  async function sendBackward() {
    const previousShapes = shapes;
    const selected = new Set(selectedShapeIds);

    const groups = new Map<string | null, Shape[]>();

    for (const shape of shapes) {
      if (!selected.has(shape.id)) continue;

      const parent = shape.frameId ?? null;

      if (!groups.has(parent)) {
        groups.set(parent, []);
      }

      groups.get(parent)!.push(shape);
    }

    const updates = new Map<string, Shape>();

    for (const [parentFrameId, selectedShapes] of groups) {
      const siblings = shapes
        .filter((s) => (s.frameId ?? null) === parentFrameId)
        .sort(compareByZIndex);

      const selectedIds = new Set(selectedShapes.map((s) => s.id));

      const orderedSelected = siblings.filter((s) => selectedIds.has(s.id));

      if (!orderedSelected.length) continue;

      const first = orderedSelected[0]!;
      const firstIndex = siblings.findIndex((s) => s.id === first.id);

      const previous = siblings[firstIndex - 1];

      if (!previous || selectedIds.has(previous.id)) continue;

      const keys = generateNKeysBetween(
        siblings[firstIndex - 2]?.zIndex ?? null,
        previous.zIndex,
        orderedSelected.length,
      );

      orderedSelected.forEach((shape, i) => {
        updates.set(shape.id, {
          ...shape,
          zIndex: keys[i]!,
        });
      });
    }

    if (!updates.size) return;

    const changedShapes = [...updates.values()];

    setShapes(
      shapes
        .map((shape) => updates.get(shape.id) ?? shape)
        .sort(compareByZIndex),
    );

    pushHistory();
    invalidate();

    try {
      await updateShapesApi(pageId, changedShapes);
    } catch {
      setShapes(previousShapes);
      invalidate();
    }
  }

  async function bringToFront() {
    const previousShapes = shapes;
    const selected = new Set(selectedShapeIds);

    const groups = new Map<string | null, Shape[]>();

    for (const shape of shapes) {
      if (!selected.has(shape.id)) continue;

      const parent = shape.frameId ?? null;

      if (!groups.has(parent)) {
        groups.set(parent, []);
      }

      groups.get(parent)!.push(shape);
    }

    const updates = new Map<string, Shape>();

    for (const [parentFrameId, selectedShapes] of groups) {
      const siblings = shapes
        .filter((s) => (s.frameId ?? null) === parentFrameId)
        .sort(compareByZIndex);

      const selectedIds = new Set(selectedShapes.map((s) => s.id));

      const orderedSelected = siblings.filter((s) => selectedIds.has(s.id));

      if (!orderedSelected.length) continue;

      const lastSibling = siblings.at(-1)!;

      if (selectedIds.has(lastSibling.id)) continue;

      const keys = generateNKeysBetween(
        lastSibling.zIndex,
        null,
        orderedSelected.length,
      );

      orderedSelected.forEach((shape, i) => {
        updates.set(shape.id, {
          ...shape,
          zIndex: keys[i]!,
        });
      });
    }

    if (!updates.size) return;

    const changedShapes = [...updates.values()];

    setShapes(
      shapes
        .map((shape) => updates.get(shape.id) ?? shape)
        .sort(compareByZIndex),
    );

    pushHistory();
    invalidate();

    try {
      await updateShapesApi(pageId, changedShapes);
    } catch {
      setShapes(previousShapes);
      invalidate();
    }
  }

  async function sendToBack() {
    const previousShapes = shapes;
    const selected = new Set(selectedShapeIds);

    const groups = new Map<string | null, Shape[]>();

    for (const shape of shapes) {
      if (!selected.has(shape.id)) continue;

      const parent = shape.frameId ?? null;

      if (!groups.has(parent)) {
        groups.set(parent, []);
      }

      groups.get(parent)!.push(shape);
    }

    const updates = new Map<string, Shape>();

    for (const [parentFrameId, selectedShapes] of groups) {
      const siblings = shapes
        .filter((s) => (s.frameId ?? null) === parentFrameId)
        .sort(compareByZIndex);

      const selectedIds = new Set(selectedShapes.map((s) => s.id));

      const orderedSelected = siblings.filter((s) => selectedIds.has(s.id));

      if (!orderedSelected.length) continue;

      const firstSibling = siblings[0]!;

      if (selectedIds.has(firstSibling.id)) continue;

      const keys = generateNKeysBetween(
        null,
        firstSibling.zIndex,
        orderedSelected.length,
      );

      orderedSelected.forEach((shape, i) => {
        updates.set(shape.id, {
          ...shape,
          zIndex: keys[i]!,
        });
      });
    }

    if (!updates.size) return;

    const changedShapes = [...updates.values()];

    setShapes(
      shapes
        .map((shape) => updates.get(shape.id) ?? shape)
        .sort(compareByZIndex),
    );
    pushHistory();
    invalidate();

    try {
      await updateShapesApi(pageId, changedShapes);
    } catch {
      setShapes(previousShapes);
      invalidate();
    }
  }

  return {
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  };
}
