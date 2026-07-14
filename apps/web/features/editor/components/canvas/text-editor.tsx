import * as store from "../../store/editor/selectors";
import useViewportHelpers from "../../interactions/viewport/use-viewport-helpers";
import useTextEditing from "../../interactions/text/use-text-editing";
import { RefObject } from "react";

type TextEditorProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

export default function TextEditor({
  canvasRef,
  textareaRef,
}: TextEditorProps) {
  const textEditingState = store.useTextEditingState();

  const textEditing = useTextEditing(canvasRef, textareaRef);

  const { canvasToClient } = useViewportHelpers(canvasRef);

  if (!textEditingState) {
    return null;
  }

  const point = canvasToClient(textEditingState.x, textEditingState.y);
  if (!point) return;

  return (
    <textarea
      ref={textareaRef}
      autoFocus
      wrap="off"
      value={textEditingState.data.text}
      onChange={textEditing.handleChange}
      onKeyDown={textEditing.handleKeyDown}
      className="fixed  field-sizing-content resize-none border-none outline-none bg-transparent overflow-hidden p-0 m-0"
      style={{ ...textEditing.style, zIndex: 3 }}
    />
  );
}
