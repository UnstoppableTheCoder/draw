import { KeyboardEvent, PointerEvent, RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import getTextDimensions from "../../utils/get-text-dimensions";
import * as store from "../../store/selectors";
import useViewportHelpers from "../viewport/use-viewport-helpers";
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
  const scale = store.useScale();
  const selectedTool = store.useSelectedTool();

  const viewportHelpers = useViewportHelpers(canvasRef);

  const saveTextShape = () => {
    if (!textEditingState) return;

    const text = textEditingState.text.trim();
    if (!text) {
      setTextEditingState(null);
      return;
    }

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const dimensions = getTextDimensions({ ctx, text, fontSize, fontFamily });
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
                  ...getTextDimensions({
                    ctx,
                    text,
                    fontSize: shape.fontSize,
                    fontFamily: shape.fontFamily,
                  }),
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

  const handleDoubleClick = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || selectedTool === "eraser") return;

    const point = viewportHelpers.clientToCanvas(e.clientX, e.clientY);
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
      fontSize,
      fontFamily,
    });
  }

  function finishEditingIfClickedOutside(event: PointerEvent) {
    if (!textEditingState) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    saveTextShape();
  }

  return {
    handleKeyDown,
    handleDoubleClick,
    startEditingText,
    finishEditingIfClickedOutside,
  };
}
