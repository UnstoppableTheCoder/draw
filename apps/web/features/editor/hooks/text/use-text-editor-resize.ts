import { RefObject, useEffect } from "react";
import * as store from "../../store/selectors";
import { FontSizePicker } from "../../components/properties-panel/font-tools/font-size-picker/font-size-picker";

export default function useTextEditorResize(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
  const textEditingState = store.useTextEditingState();
  const lineHeightMultiplier = 1.2;

  // Adjusts Width and Height of textarea -> using field-sizing-content class
  // useEffect(() => {
  //   if (!textEditingState) return;

  //   const { fontSize, fontFamily } = textEditingState;
  //   if (!fontSize || !fontFamily) return;

  //   const textarea = textareaRef.current;
  //   const canvas = canvasRef.current;
  //   if (!textarea || !canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   ctx.font = `${fontSize}px ${fontFamily}`;

  //   const lines = textEditingState.text.split("\n");
  //   const longestWidth = Math.max(
  //     ...lines.map((line) => ctx.measureText(line || " ").width),
  //     1,
  //   );
  //   const lineHeight = fontSize ?? 20 * lineHeightMultiplier;

  //   textarea.style.width = `${longestWidth + 8}px`;
  //   textarea.style.height = `${Math.max(
  //     lineHeight,
  //     lines.length * lineHeight,
  //   )}px`;
  // }, [textEditingState, lineHeightMultiplier]);
}
