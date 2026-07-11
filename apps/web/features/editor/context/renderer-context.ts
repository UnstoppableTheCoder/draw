"use client";

import { createContext } from "react";

export type Renderer = {
  invalidate: () => void;
  invalidateBackground: () => void;
  invalidateScene: () => void;
  invalidateOverlay: () => void;
};

export const RendererContext = createContext<Renderer | null>(null);
