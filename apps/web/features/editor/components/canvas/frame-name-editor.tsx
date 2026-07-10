import { RefObject, useMemo } from "react";

import useViewportHelpers from "../../hooks/viewport/use-viewport-helpers";

import getTextDimensions from "../../utils/get-text-dimensions";
import { TOLERANCE } from "../../constants/canvas";
import useFrameNameEditor from "../../hooks/frame/use-frame-name-editor";

type FrameNameEditorProps = {
  frameNameInputRef: RefObject<HTMLInputElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
  frameEditor: ReturnType<typeof useFrameNameEditor>;
};

export default function FrameNameEditor({
  frameNameInputRef,
  overlayCanvasRef,
  frameEditor,
}: FrameNameEditorProps) {
  const viewportHelpers = useViewportHelpers(overlayCanvasRef);

  const { frame, value, finishEditing, handleChange, handleKeyDown } =
    frameEditor;

  const style = useMemo(() => {
    if (!frame || frame.type !== "frame") return null;

    const ctx = overlayCanvasRef.current?.getContext("2d");
    if (!ctx) return null;

    const point = viewportHelpers.canvasToClient(frame.x, frame.y);
    if (!point) return null;

    const { width, height } = getTextDimensions({
      ctx,
      text: value || " ",
      fontSize: frame.text.fontSize,
      fontFamily: frame.text.fontFamily,
    });

    return {
      position: "absolute" as const,
      left: point.x,
      top: point.y - height - TOLERANCE,
      width: width + 20,
      height: height + 20,
      fontSize: `${frame.text.fontSize}px`,
      fontFamily: frame.text.fontFamily,
    };
  }, [frame, value, overlayCanvasRef, viewportHelpers]);

  if (!frame || !style) {
    return null;
  }

  return (
    <input
      ref={frameNameInputRef}
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={finishEditing}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      className="absolute rounded-md bg-gray-600 px-2 text-white outline-none z-10"
      style={style}
    />
  );
}
