import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useFrameEditingState,
  useSetFrameEditingState,
  useSetShapes,
  useShapes,
} from "../../store/editor/selectors";
import useViewportHelpers from "../../hooks/viewport/use-viewport-helpers";
import getTextDimensions from "../../utils/get-text-dimensions";
import { TOLERANCE } from "../../constants/canvas";
import { useCanvasRenderer } from "../../context/use-renderer";

type FrameNameEditorProps = {
  frameNameInputRef: RefObject<HTMLInputElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
};

export default function FrameNameEditor({
  frameNameInputRef,
  overlayCanvasRef,
}: FrameNameEditorProps) {
  const shapes = useShapes();
  const setShapes = useSetShapes();
  const frameEditingState = useFrameEditingState();
  const setFrameEditingState = useSetFrameEditingState();
  const { invalidateScene, invalidate, invalidateOverlay } =
    useCanvasRenderer();

  const viewportHelpers = useViewportHelpers(overlayCanvasRef);

  const frame =
    frameEditingState &&
    shapes.find(
      (shape) =>
        shape.id === frameEditingState.frameId && shape.type === "frame",
    );

  const [value, setValue] = useState("");

  useEffect(() => {
    if (!frame || frame.type !== "frame") return;

    setValue(frame.text.name);

    requestAnimationFrame(() => {
      frameNameInputRef.current?.focus();
      frameNameInputRef.current?.select();
    });
  }, [frame?.id]);

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
      left: point.x - 20,
      top: point.y - height - TOLERANCE * 1.5,
      width: width + 20,
      height: height + 20,
      fontSize: `${frame.text.fontSize}px`,
      fontFamily: frame.text.fontFamily,
    };
  }, [frame, value, overlayCanvasRef, viewportHelpers]);

  const updateFrameName = (frameId: string, value: string) => {
    if (!overlayCanvasRef.current) return;
    const ctx = overlayCanvasRef.current.getContext("2d");
    if (!ctx) return;

    setShapes((prevShapes) =>
      prevShapes.map((shape) => {
        if (shape.type !== "frame") return shape;

        return shape.id === frameId
          ? {
              ...shape,
              text: {
                ...shape.text,
                name: value,
                ...getTextDimensions({
                  ctx,
                  text: value,
                  fontSize: shape.text.fontSize,
                  fontFamily: shape.text.fontFamily,
                }),
              },
            }
          : shape;
      }),
    );

    invalidate();
  };

  const finishEditing = () => {
    if (!frame) return;

    updateFrameName(frame.id, value);

    setFrameEditingState(null);
    invalidate();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (frame?.type !== "frame") return;

    if (event.key === "Enter") {
      finishEditing();
    }

    if (event.key === "Escape") {
      setValue(frame.text.name ?? "");
      setFrameEditingState(null);
    }
  };

  if (!frame || !style) return null;

  return (
    <input
      ref={frameNameInputRef}
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={finishEditing}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      className="absolute bg-gray-600 text-white outline-none px-2 z-10 rounded-lg"
      style={style}
    />
  );
}
