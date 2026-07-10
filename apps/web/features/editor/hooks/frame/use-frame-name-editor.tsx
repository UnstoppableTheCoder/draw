import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useEffect,
  useState,
} from "react";

import {
  useFrameEditingState,
  useSetFrameEditingState,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";
import getTextDimensions from "../../utils/get-text-dimensions";

export default function useFrameNameEditor(
  frameNameInputRef: RefObject<HTMLInputElement | null>,
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const [value, setValue] = useState("");

  const shapes = useShapes();
  const setShapes = useSetShapes();

  const frameEditingState = useFrameEditingState();
  const setFrameEditingState = useSetFrameEditingState();

  const { invalidate } = useCanvasRenderer();

  const frame =
    frameEditingState &&
    shapes.find(
      (shape) =>
        shape.type === "frame" && shape.id === frameEditingState.frameId,
    );

  useEffect(() => {
    if (!frame || frame.type !== "frame") return;

    setValue(frame.text.name);

    requestAnimationFrame(() => {
      frameNameInputRef.current?.focus();
      frameNameInputRef.current?.select();
    });
  }, [frame?.id]);

  const updateFrameName = (value: string) => {
    if (!frame) return;

    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) return;

    setShapes((prev) =>
      prev.map((shape) => {
        if (shape.type !== "frame" || shape.id !== frame.id) {
          return shape;
        }

        return {
          ...shape,
          text: {
            ...shape.text,
            name: value,
            ...getTextDimensions({
              ctx,
              text: value,
              fontSize: shape.text.fontSize,
              fontFamily: shape.text.fontFamily,
            }),
          },
        };
      }),
    );

    invalidate();
  };

  const finishEditing = () => {
    updateFrameName(value);
    setFrameEditingState(null);
  };

  const cancelEditing = () => {
    if (!frame || frame.type !== "frame") return;

    setValue(frame.text.name);
    setFrameEditingState(null);
  };

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

  return {
    frame,
    value,
    setValue,
    finishEditing,
    handleChange,
    handleKeyDown,
  };
}
