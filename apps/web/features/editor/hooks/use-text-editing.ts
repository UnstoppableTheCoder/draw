import { KeyboardEvent, PointerEvent, RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import getTextDimensions from "../utils/get-text-dimensions";
import {
  useShapesState,
  useTextEditingState,
  useTextStyleState,
  useToolState,
} from "../store/selectors";

export default function useTextEditing(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
  const { fontSize, fontFamily } = useTextStyleState();
  const { textEditingState, setTextEditingState } = useTextEditingState();
  const { setShapes } = useShapesState();
  const { setSelectedTool } = useToolState();

  const font = `${fontSize} ${fontFamily}`;

  function initializeTextEditing(startPoint: Point) {
    setTextEditingState({
      x: startPoint.x,
      y: startPoint.y,
      text: "",
    });
  }

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

    // Todo: Check if this is a canvas coordinate
    const { x, y } = textEditingState;

    setShapes((prev) => {
      // if (textEditingState.id) {
      //   return prev.map((shape) =>
      //     shape.id === textEditingState.id
      //       ? {
      //           ...shape,
      //           text,
      //         }
      //       : shape,
      //   );
      // }

      return [
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
      ];
    });

    setTextEditingState(null);
    // Set Tool to "select"
    setSelectedTool("select");
  };

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
