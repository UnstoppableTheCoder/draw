import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import * as store from "../../store/selectors";
import useViewportHelpers from "../../hooks/viewport/use-viewport";

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
  const panOffset = store.usePanOffset();
  const scale = store.useScale();
  const scaleOffset = store.useScaleOffset();

  const textEditingState = store.useTextEditingState();
  const setTextEditingState = store.useSetTextEditingState();
  const lineHeightMultiplier = store.useLineHeightMultiplier();

  const { getCanvasToScreenCoordinates } = useViewportHelpers({
    canvasRef,
    panOffset,
    scale,
    scaleOffset,
  });

  if (!textEditingState) {
    return null;
  }

  const point = getCanvasToScreenCoordinates(
    textEditingState.x,
    textEditingState.y,
  );

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
      (textEditingState.fontSize ? textEditingState.fontSize * scale : 20) +
      "px",
    fontFamily: textEditingState.fontFamily ?? "Arial",
    color: textEditingState.strokeColor ?? "white",
    lineHeight: lineHeightMultiplier,
  };

  return (
    <textarea
      ref={textareaRef}
      autoFocus
      wrap="off"
      value={textEditingState.text}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      className="fixed field-sizing-content resize-none border-none outline-none bg-transparent overflow-hidden"
      style={style}
    />
  );
}
