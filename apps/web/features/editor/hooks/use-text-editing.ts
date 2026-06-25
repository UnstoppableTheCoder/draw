import { KeyboardEvent, PointerEvent, RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import getTextDimensions from "../utils/get-text-dimensions";
import * as store from "../store/selectors";
import { getScreenToCanvasCoordinates } from "../utils/get-coordinates";
import { usePointerState } from "./use-pointer-state";

export default function useTextEditing(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  pointerRefs: ReturnType<typeof usePointerState>,
) {
  const setSelectedTool = store.useSetSelectedTool();
  const setShapes = store.useSetShapes();
  const setTextEditingState = store.useSetTextEditingState();
  const fontSize = store.useFontSize();
  const fontFamily = store.useFontFamily();
  const textEditingState = store.useTextEditingState();
  const panOffset = store.usePanOffset();
  const scale = store.useScale();
  const scaleOffset = store.useScaleOffset();

  // If we have id in textEditingState - we are editing a shape
  const saveTextShape = () => {
    if (!textEditingState) return;

    const text = textEditingState.text.trim();
    if (!text) {
      setTextEditingState(null);
      return;
    }

    const dimensions = getTextDimensions(canvasRef, text, fontSize, fontFamily);
    if (!dimensions) return;

    const width = dimensions.width;
    const height = dimensions.height;

    const { x, y } = textEditingState;

    setShapes((prevShapes) => {
      return textEditingState.id
        ? prevShapes.map((shape) =>
            shape.id === textEditingState.id
              ? {
                  id: uuidv4(),
                  type: "text",
                  text,
                  x,
                  y,
                  height,
                  width,
                  fontSize,
                  fontFamily,
                  strokeColor: "white",
                }
              : shape,
          )
        : [
            ...prevShapes,
            {
              id: uuidv4(),
              type: "text",
              text,
              x,
              y,
              height,
              width,
              fontSize,
              fontFamily,
              strokeColor: "white",
            },
          ];
    });

    // Reset to Default when the text is drawn
    setTextEditingState(null);
    setSelectedTool("select");
  };

  // Saves the text - if Escape clicked
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      saveTextShape();
    }
  };

  // if click is outside the textarea -> saves text shape
  const handleParentPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (textEditingState && e.target !== textareaRef.current) {
      saveTextShape();

      // Setting the value to null when clicked outside the textarea box
      // pointerRefs.pointerDownTimeRef.current = null;
    }
  };

  const handleDoubleClick = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getScreenToCanvasCoordinates({
      screenX: e.clientX,
      screenY: e.clientY,
      canvas,
      panOffset,
      scale,
      scaleOffset,
    });

    setTextEditingState({ x: point.x, y: point.y, text: "" });
  };

  return { handleKeyDown, handleParentPointerDown, handleDoubleClick };
}
