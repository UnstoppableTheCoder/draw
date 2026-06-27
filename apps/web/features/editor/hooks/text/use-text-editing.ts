import { KeyboardEvent, PointerEvent, RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import getTextDimensions from "../../utils/get-text-dimensions";
import * as store from "../../store/selectors";
import useViewportHelpers from "../viewport/use-viewport";
import { Point } from "../../types/types";

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
  const panOffset = store.usePanOffset();
  const scale = store.useScale();
  const scaleOffset = store.useScaleOffset();
  const selectedTool = store.useSelectedTool();

  const viewportHelpers = useViewportHelpers({
    canvasRef,
    panOffset,
    scale,
    scaleOffset,
  });

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

    setShapes((prevShapes) => {
      return textEditingState.id
        ? prevShapes.map((shape) =>
            shape.id === textEditingState.id && shape.type === "text"
              ? {
                  ...shape,
                  text,
                  ...getTextDimensions(
                    canvasRef,
                    text,
                    shape.fontSize,
                    shape.fontFamily,
                  ),
                }
              : shape,
          )
        : [
            ...prevShapes,
            {
              ...textEditingState,
              id: uuidv4(),
              height: height / scale,
              width: width / scale,
              fontSize: fontSize / scale,
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
    }
  };

  const handleDoubleClick = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || selectedTool === "eraser") return;

    const point = viewportHelpers.getScreenToCanvasCoordinates(
      e.clientX,
      e.clientY,
    );
    if (!point) return;

    // Once the value is set - textarea appears
    setTextEditingState({
      type: "text",
      x: point.x,
      y: point.y,
      text: "",
    });
  };

  function startEditingText(point: Point) {
    setTextEditingState({
      id: uuidv4(),
      type: "text",
      x: point.x,
      y: point.y,
      text: "",
    });
  }

  return {
    handleKeyDown,
    handleParentPointerDown,
    handleDoubleClick,
    startEditingText,
  };
}
