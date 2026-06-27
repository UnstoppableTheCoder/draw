import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { EditorStore } from "./editor-types";
import {
  createToolSlice,
  createShapeSlice,
  createEraserSlice,
  createSelectionSlice,
  createTextEditingSlice,
  createViewportSlice,
  createHistorySlice,
  createTextStyleSlice,
} from "./slices";

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
      ...createTextStyleSlice(...args),
    }),
    {
      name: "editor-store",
    },
  ),
);
