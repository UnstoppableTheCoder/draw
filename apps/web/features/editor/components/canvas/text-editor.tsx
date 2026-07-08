import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import * as store from "../../store/editor/selectors";
import useViewportHelpers from "../../hooks/viewport/use-viewport-helpers";
import { useLineHeightMultiplier } from "../../store/properties/selectors";

type TextEditorProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function TextEditor({
  canvasRef,
  textareaRef,
  onKeyDown,
}: TextEditorProps) {
  const scale = store.useScale();
  const textEditingState = store.useTextEditingState();
  const setTextEditingState = store.useSetTextEditingState();

  // Style
  const lineHeightMultiplier = useLineHeightMultiplier();

  const { canvasToClient } = useViewportHelpers(canvasRef);

  if (!textEditingState) {
    return null;
  }

  const point = canvasToClient(textEditingState.x, textEditingState.y);
  if (!point) return;

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setTextEditingState((prev) =>
      prev
        ? {
            ...prev,
            text: value,
          }
        : null,
    );
  }

  const style = {
    left: point.x - 1,
    top: point.y - 4,
    fontSize:
      (textEditingState.fontSize && textEditingState.id
        ? textEditingState.fontSize * scale
        : (textEditingState.fontSize ?? 20)) + "px",
    fontFamily: textEditingState.fontFamily ?? "Arial",
    color: textEditingState.strokeColor ?? "white",
    lineHeight: lineHeightMultiplier,
    textAlign: textEditingState.textAlign,
  };

  return (
    <textarea
      ref={textareaRef}
      autoFocus
      wrap="off"
      value={textEditingState.text}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      className="fixed field-sizing-content resize-none border-none outline-none bg-transparent overflow-hidden p-0 m-0"
      style={{ ...style, zIndex: 2 }}
    />
  );
}
