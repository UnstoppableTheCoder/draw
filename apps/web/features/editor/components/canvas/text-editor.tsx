import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import {
  useTextEditingState,
  useTextStyleState,
  useViewportState,
} from "../../store/selectors";
import { getCanvasToScreenCoordinates } from "../../utils/get-coordinates";

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
  const { panOffset, scale, scaleOffset } = useViewportState();
  const { textEditingState, setTextEditingState } = useTextEditingState();
  const { fontSize, fontFamily, lineHeightMultiplier } = useTextStyleState();

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
