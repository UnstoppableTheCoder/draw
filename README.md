# Fix the Shape Select for Circle, Ellipse and Image

# Implement Bounding box

# Implement Shape Move Feature

# Implement Shape Resize Feature

# Implement Shape Properties Features

# Implement Edit Shape Features

# Implement WebSocket

# Integrate DB

# Implement Room and real time collaboration

# Implement Authentication

# Add more pages

# Implement add video on canvas feature

# Make it look like Excalidraw Website

# Work on Deployment on AWS

# Try to scale the server

# Try DB scaling if possible

Learn LERP (30 min)
Learn Parametric Line Equation (1–2 hours)
Learn Line Intersection
Learn Ray Casting / Point in Polygon
Learn Vector Math (dot product, cross product)


components/
└── excalidraw/
    ├── editor.tsx                 <-- Top level editor
    ├── canvas.tsx                 <-- Only renders canvas
    ├── text-editor.tsx
    ├── zoom-controllers.tsx
    │
    ├── hooks/
    │   ├── use-canvas-size.ts
    │   ├── use-canvas-renderer.ts
    │   ├── use-canvas-interaction.ts
    │   ├── use-image-upload.ts
    │   ├── use-text-editing.ts
    │   ├── use-textarea-resize.ts
    │   ├── use-shape-move.ts
    │   ├── use-shape-resize.ts
    │   ├── use-pan.ts
    │   ├── use-history.ts
    │   └── use-shortcuts.ts
    │
    ├── state/
    │   ├── use-shapes.ts
    │   ├── use-selection.ts
    │   └── use-editor-state.ts
    │
    ├── rendering/
    │   ├── render-scene.ts
    │   ├── render-shape.ts
    │   ├── render-selection.ts
    │   ├── render-resize-handles.ts
    │   ├── render-preview.ts
    │   └── render-grid.ts
    │
    ├── interactions/
    │   ├── pointer-down.ts
    │   ├── pointer-move.ts
    │   ├── pointer-up.ts
    │   ├── selection.ts
    │   ├── dragging.ts
    │   ├── resizing.ts
    │   └── panning.ts
    │
    ├── geometry/
    │   ├── bounds.ts
    │   ├── hit-testing.ts
    │   ├── resize.ts
    │   ├── transforms.ts
    │   ├── line-distance.ts
    │   └── coordinates.ts
    │
    ├── types/
    │   ├── shape.ts
    │   ├── point.ts
    │   └── resize-handle.ts
    │
    └── constants/
        ├── canvas.ts
        └── tools.ts