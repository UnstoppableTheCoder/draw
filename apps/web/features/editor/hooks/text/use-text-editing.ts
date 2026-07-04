import { KeyboardEvent, PointerEvent, RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import getTextDimensions from "../../utils/get-text-dimensions";
import * as store from "../../store/editor/selectors";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import { Point, Shape } from "../../types/types";
import {
  useFontFamily,
  useFontSize,
  useStrokeColor,
} from "../../store/properties/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";

export default function useTextEditing(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
  const setSelectedTool = store.useSetSelectedTool();
  const setShapes = store.useSetShapes();
  const setTextEditingState = store.useSetTextEditingState();
  const textEditingState = store.useTextEditingState();
  const scale = store.useScale();
  const selectedTool = store.useSelectedTool();

  // Styles
  const fontSize = useFontSize();
  const fontFamily = useFontFamily();
  const strokeColor = useStrokeColor();

  const { invalidate } = useCanvasRenderer();

  const viewportHelpers = useViewportHelpers(canvasRef);

  const saveTextShape = () => {
    if (!textEditingState) return;

    const text = textEditingState.text.trim();

    if (!text) {
      finishTextEditing();
      return;
    }

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    setShapes((prevShapes) =>
      textEditingState.id
        ? updateTextShape(prevShapes, textEditingState.id, text, ctx)
        : createTextShape(prevShapes, textEditingState, text, ctx),
    );

    finishTextEditing();
    invalidate();
  };

  function finishTextEditing() {
    setTextEditingState(null);
    setSelectedTool("select");
  }

  function updateTextShape(
    shapes: Shape[],
    id: string,
    text: string,
    ctx: CanvasRenderingContext2D,
  ): Shape[] {
    return shapes.map((shape) => {
      if (shape.id !== id || shape.type !== "text") {
        return shape;
      }

      return {
        ...shape,
        text,
        ...getTextDimensions({
          ctx,
          text,
          fontSize: shape.fontSize,
          fontFamily: shape.fontFamily,
        }),
      };
    });
  }

  function createTextShape(
    shapes: Shape[],
    editingState: NonNullable<typeof textEditingState>,
    text: string,
    ctx: CanvasRenderingContext2D,
  ): Shape[] {
    const { width, height } = getTextDimensions({
      ctx,
      text,
      fontSize,
      fontFamily,
    });

    return [
      ...shapes,
      {
        ...editingState,
        id: uuidv4(),
        text,
        width: width / scale,
        height: height / scale,
        fontSize: fontSize / scale,
        fontFamily,
      },
    ];
  }

  // Saves the text - if Escape clicked
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      if (!textEditingState) return;

      const textarea = textareaRef.current;
      if (!textarea) return;

      saveTextShape();
    }
  };

  const handleDoubleClick = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || selectedTool === "eraser") return;

    const point = viewportHelpers.clientToCanvas(e.clientX, e.clientY);
    if (!point) return;

    onPointerDownText(point);
  };

  function onPointerDownText(point: Point) {
    setTextEditingState({
      type: "text",
      x: point.x,
      y: point.y,
      text: "",
      fontSize,
      fontFamily,
      strokeColor,
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
    onPointerDownText,
    finishEditingIfClickedOutside,
  };
}
