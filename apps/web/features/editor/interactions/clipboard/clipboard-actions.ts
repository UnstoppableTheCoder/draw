import { ImageAsset, Shape } from "../../types";

export interface ClipboardData {
  shapes: Shape[];
  imageAssets: ImageAsset[];
}

let memoryClipboard: ClipboardData | null = null;

export async function writeClipboard(clipboard: ClipboardData): Promise<void> {
  memoryClipboard = structuredClone(clipboard);

  if (!navigator.clipboard) {
    return;
  }

  try {
    await navigator.clipboard.writeText(JSON.stringify(clipboard));
  } catch {
    // Ignore browser clipboard errors.
  }
}

export async function readClipboard(): Promise<ClipboardData | null> {
  if (memoryClipboard) {
    return structuredClone(memoryClipboard);
  }

  if (!navigator.clipboard) {
    return null;
  }

  try {
    const text = await navigator.clipboard.readText();

    if (!text) {
      return null;
    }

    const clipboard = JSON.parse(text) as ClipboardData;

    if (
      !clipboard ||
      !Array.isArray(clipboard.shapes) ||
      !Array.isArray(clipboard.imageAssets)
    ) {
      return null;
    }

    memoryClipboard = clipboard;

    return structuredClone(clipboard);
  } catch {
    return null;
  }
}
