import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useFrameEditingState,
  usePushHistory,
  useSetFrameEditingState,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";
import getTextDimensions from "../../geometry/text/get-text-dimensions";
import { TOLERANCE } from "../../constants/canvas";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import { updateShapesApi } from "../../networking/api/shape-api";
import { Shape } from "../../types";
import { useParams } from "next/navigation";

export default function useFrameNameEditor(
  frameNameInputRef: RefObject<HTMLInputElement | null>,
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const { pageId } = useParams<{ pageId: string }>();
  const [value, setValue] = useState("");

  const shapes = useShapes();
  const setShapes = useSetShapes();
  const pushHistory = usePushHistory();

  const frameEditingState = useFrameEditingState();
  const setFrameEditingState = useSetFrameEditingState();

  const { invalidate } = useCanvasRenderer();
  const viewportHelpers = useViewportHelpers(overlayCanvasRef);

  const frame =
    frameEditingState &&
    shapes.find(
      (shape) =>
        shape.type === "frame" && shape.id === frameEditingState.frameId,
    );

  useEffect(() => {
    if (!frame || frame.type !== "frame") return;

    const {
      data: { text },
    } = frame;

    setValue(text.name);

    const nextShapes = shapes.map((shape) =>
      shape.id === frame.id && shape.type === "frame"
        ? {
            ...shape,
            data: {
              ...shape.data,
              text: {
                ...shape.data.text,
                name: "",
              },
            },
          }
        : shape,
    );

    setShapes(nextShapes);
    invalidate();
  }, [frame?.id, frameNameInputRef]);

  const updateFrameName = useCallback(async () => {
    if (!frame || frame.type !== "frame") return;

    const frameName = value.trim() || "Frame Name";

    if (frame.data.text.name === frameName) {
      return;
    }

    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) return;

    const previousShapes = shapes;

    const nextFrame: Shape = {
      ...frame,
      data: {
        ...frame.data,
        text: {
          ...frame.data.text,
          name: frameName,
          ...getTextDimensions({
            ctx,
            text: frameName,
            fontSize: frame.data.text.fontSize,
            fontFamily: frame.data.text.fontFamily,
          }),
        },
      },
    };

    const nextShapes = previousShapes.map((shape) =>
      shape.id === nextFrame.id ? nextFrame : shape,
    );

    setShapes(nextShapes);
    pushHistory();
    invalidate();

    try {
      await updateShapesApi(pageId, [nextFrame]);
    } catch (error) {
      console.error("Failed to update frame name", error);

      setShapes(previousShapes);
      invalidate();
    }
  }, [frame, value, shapes, pageId, setShapes, invalidate, overlayCanvasRef]);

  const finishEditing = useCallback(async () => {
    setFrameEditingState(null);
    await updateFrameName();
  }, [updateFrameName, setFrameEditingState]);

  const cancelEditing = useCallback(() => {
    if (!frame || frame.type !== "frame") return;

    setValue(frame.data.text.name);
    setFrameEditingState(null);
  }, [frame, setFrameEditingState]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        finishEditing();
        break;

      case "Escape":
        cancelEditing();
        break;
    }
  };

  const style = useMemo(() => {
    if (!frame || frame.type !== "frame") return null;

    const {
      data: { text },
    } = frame;

    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) return null;

    const point = viewportHelpers.canvasToClient(frame.x, frame.y);
    if (!point) return null;

    const { width, height } = getTextDimensions({
      ctx,
      text: value || " ",
      fontSize: text.fontSize,
      fontFamily: text.fontFamily,
    });

    return {
      position: "absolute" as const,
      left: point.x,
      top: point.y - height - TOLERANCE,
      width: width + 20,
      height: height + 20,
      fontSize: `${text.fontSize}px`,
      fontFamily: text.fontFamily,
    };
  }, [frame, value, overlayCanvasRef, viewportHelpers]);

  // Handles Finish Frame Text Editing
  useEffect(() => {
    if (!frameEditingState) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (frameNameInputRef.current?.contains(event.target as Node)) {
        return;
      }

      void finishEditing();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [frameEditingState, finishEditing]);

  return {
    frame,
    style,
    value,
    setValue,
    finishEditing,
    handleChange,
    handleKeyDown,
  };
}
