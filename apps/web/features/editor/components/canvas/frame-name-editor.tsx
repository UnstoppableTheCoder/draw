import { RefObject } from "react";

import useFrameNameEditor from "../../interactions/frame/use-frame-name-editor";

type FrameNameEditorProps = {
  frameNameInputRef: RefObject<HTMLInputElement | null>;
  frameEditor: ReturnType<typeof useFrameNameEditor>;
};

export default function FrameNameEditor({
  frameNameInputRef,
  frameEditor,
}: FrameNameEditorProps) {
  const { frame, style, value, handleChange, handleKeyDown } = frameEditor;

  if (!frame || !style) {
    return null;
  }

  return (
    <input
      ref={frameNameInputRef}
      type="text"
      value={value}
      style={style}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      className="absolute rounded-md bg-gray-600 px-2 text-white outline-none z-10"
    />
  );
}
