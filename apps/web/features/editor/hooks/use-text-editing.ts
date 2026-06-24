import { KeyboardEvent, PointerEvent, RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import getTextDimensions from "../utils/get-text-dimensions";
import * as store from "../store/selectors";

export default function useTextEditing(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
  const setSelectedTool = store.useSetSelectedTool();
  const setShapes = store.useSetShapes();
  const setTextEditingState = store.useSetTextEditingState();
  const fontSize = store.useFontSize();
  const fontFamily = store.useFontFamily();
  const textEditingState = store.useTextEditingState();

  const font = `${fontSize}px ${fontFamily}`;

  const saveTextShape = () => {
    if (!textEditingState) return;

    const text = textEditingState.text.trim();
    if (!text) {
      setTextEditingState(null);
      return;
    }

    const dimensions = getTextDimensions(canvasRef, text, font);
    if (!dimensions) return;

    const width = dimensions.width;
    const height = dimensions.height;

    const { x, y } = textEditingState;

    setShapes((prev) => [
      ...prev,
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
    ]);

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
    }
  };

  return { handleKeyDown, handleParentPointerDown };
}
