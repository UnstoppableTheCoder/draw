"use client";

import { createContext } from "react";

export type Renderer = {
  renderScene: () => void;
  renderOverlay: () => void;

  invalidate: () => void;
  invalidateScene: () => void;
  invalidateOverlay: () => void;
};

export const RendererContext = createContext<Renderer | null>(null);
