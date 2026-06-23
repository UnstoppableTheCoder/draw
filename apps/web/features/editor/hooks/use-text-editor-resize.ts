import { RefObject, useEffect } from "react";
import * as store from "../store/selectors";

export default function useTextEditorResize(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
  const textEditingState = store.useTextEditingState();
  const fontSize = store.useFontSize();
  const fontFamily = store.useFontFamily();
  const lineHeightMultiplier = store.useLineHeightMultiplier();

  // Adjusts Width and Height of textarea
  useEffect(() => {
    if (!textEditingState) return;

    const textarea = textareaRef.current;
    const canvas = canvasRef.current;
    if (!textarea || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = `${fontSize}px ${fontFamily}`;

    const lines = textEditingState.text.split("\n");
    const longestWidth = Math.max(
      ...lines.map((line) => ctx.measureText(line || " ").width),
      1,
    );
    const lineHeight = fontSize * lineHeightMultiplier;

    textarea.style.width = `${longestWidth + 8}px`;
    textarea.style.height = `${Math.max(
      lineHeight,
      lines.length * lineHeight,
    )}px`;
  }, [textEditingState?.text, fontSize, fontFamily, lineHeightMultiplier]);
}
