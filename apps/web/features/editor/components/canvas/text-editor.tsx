import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import { getCanvasToScreenCoordinates } from "../../utils/get-coordinates";
import * as store from "../../store/selectors";

type TextEditorProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

{
  /* You can also add this class too -> field-sizing-content */
}
export default function TextEditor({
  textareaRef,
  onKeyDown,
}: TextEditorProps) {
  const panOffset = store.usePanOffset();
  const scale = store.useScale();
  const scaleOffset = store.useScaleOffset();
  const setTextEditingState = store.useSetTextEditingState();
  const fontSize = store.useFontSize();
  const fontFamily = store.useFontFamily();
  const lineHeightMultiplier = store.useLineHeightMultiplier();
  const textEditingState = store.useTextEditingState();

  // Decides if the textarea should appear or not
  if (!textEditingState) return;

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setTextEditingState((prev) =>
      prev ? { ...prev, text: e.target.value } : prev,
    );

  const { x, y } = getCanvasToScreenCoordinates({
    canvasX: textEditingState.x,
    canvasY: textEditingState.y,
    panOffset,
    scale,
    scaleOffset,
  });

  return (
    <textarea
      ref={textareaRef}
      wrap="off"
      autoFocus
      className="absolute border-none resize-none outline-none overflow-hidden"
      value={textEditingState.text}
      onChange={handleOnChange}
      style={{
        left: x - 1,
        top: y - 4,
        fontSize,
        background: "transparent",
        color: "white",
        fontFamily,
        lineHeight: lineHeightMultiplier,
      }}
      onKeyDown={onKeyDown}
    />
  );
}
