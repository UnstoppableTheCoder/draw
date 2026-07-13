import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { EditorStore } from "./editor-types";
import {
  createEraserSlice,
  createHistorySlice,
  createSelectionSlice,
  createShapeSlice,
  createTextEditingSlice,
  createToolSlice,
  createViewportSlice,
} from "./slices";
import { createFrameSlice } from "./slices/frame-slice";
import { createImageSlice } from "./slices/image-slice";

export const useEditorStore = create<EditorStore>()(
  devtools(
    (...args) => ({
      ...createToolSlice(...args),
      ...createShapeSlice(...args),
      ...createEraserSlice(...args),
      ...createSelectionSlice(...args),
      ...createTextEditingSlice(...args),
      ...createViewportSlice(...args),
      ...createHistorySlice(...args),
      ...createFrameSlice(...args),
      ...createImageSlice(...args),
    }),
    {
      name: "editor-store",
    },
  ),
);
