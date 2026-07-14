import React, {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";
import getTextDimensions from "../../geometry/text/get-text-dimensions";
import * as store from "../../store/editor/selectors";
import {
  useFontFamily,
  useFontSize,
  useLineHeightMultiplier,
  useStrokeColor,
  useTextAlign,
} from "../../store/properties/selectors";
import { useCanvasRenderer } from "../../context/use-renderer";
import useViewportHelpers from "../viewport/use-viewport-helpers";
import { getFrameAtPosition } from "../shared/get-frame-at-position";
import { Point, Shape } from "../../types";
import { createBaseShape, DEFAULT_APPEARANCE } from "../draw/create-shape";
import { getNextZIndex } from "../../utils/z-index";

export default function useTextEditing(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
  const setSelectedTool = store.useSetSelectedTool();
  const setShapes = store.useSetShapes();
  const shapes = store.useShapes();
  const setTextEditingState = store.useSetTextEditingState();
  const textEditingState = store.useTextEditingState();
  const scale = store.useScale();
  const selectedTool = store.useSelectedTool();
  const setHoveredFrameId = store.useSetHoveredFrameId();
  const hoveredFrameId = store.useHoveredFrameId();

  // Styles
  const fontSize = useFontSize();
  const fontFamily = useFontFamily();
  const strokeColor = useStrokeColor();
  const textAlign = useTextAlign();
  const lineHeightMultiplier = useLineHeightMultiplier();

  const { invalidate, invalidateScene } = useCanvasRenderer();

  const viewportHelpers = useViewportHelpers(canvasRef);

  function handleDrawTextOverFrame(start: Point) {
    const hoveredFrame = getFrameAtPosition({
      point: start,
      shapes,
      scale,
    });

    if (hoveredFrame) {
      invalidateScene();
    }

    setHoveredFrameId(hoveredFrame?.id ?? null);
  }

  const saveTextShape = () => {
    if (!textEditingState) return;

    const text = textEditingState.data.text.trim();

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    setShapes((prevShapes) => {
      // Editing an existing text shape
      if (textEditingState.id) {
        // Delete the shape if text becomes empty
        if (!text) {
          return prevShapes.filter((shape) => shape.id !== textEditingState.id);
        }

        return updateTextShape(prevShapes, textEditingState.id, text, ctx);
      }

      // Creating a new text shape
      if (!text) {
        return prevShapes;
      }

      return createTextShape(prevShapes, textEditingState, text, ctx);
    });

    finishTextEditing();
    invalidate();
  };

  function finishTextEditing() {
    setTextEditingState(null);
    setSelectedTool("select");
  }

  function updateTextShape(
    shapes: Shape[],
    id: string,
    text: string,
    ctx: CanvasRenderingContext2D,
  ): Shape[] {
    return shapes.map((shape) => {
      if (shape.id !== id || shape.type !== "text") {
        return shape;
      }

      return {
        ...shape,
        data: {
          ...shape.data,
          text,
        },
        ...getTextDimensions({
          ctx,
          text,
          fontSize: shape.data.fontSize,
          fontFamily: shape.data.fontFamily,
        }),
      };
    });
  }

  function createTextShape(
    shapes: Shape[],
    editingState: NonNullable<typeof textEditingState>,
    text: string,
    ctx: CanvasRenderingContext2D,
  ): Shape[] {
    const { width, height } = getTextDimensions({
      ctx,
      text,
      fontSize,
      fontFamily,
    });

    const zIndex = getNextZIndex(shapes);

    return [
      ...shapes,
      createBaseShape(
        "text",
        {
          x: editingState.x,
          y: editingState.y,
          width: width / scale,
          height: height / scale,
        },
        {
          text,
          fontSize: fontSize / scale,
          fontFamily,
          textAlign,
          lineHeight: lineHeightMultiplier,
        },
        {
          ...DEFAULT_APPEARANCE.text,
          strokeColor,
        },
        zIndex,
      ),
    ];
  }

  // Saves the text - if Escape clicked
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      if (!textEditingState) return;

      const textarea = textareaRef.current;
      if (!textarea) return;

      saveTextShape();
    }
  };

  const handleDoubleClick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || selectedTool === "eraser" || selectedTool === "pan") return;

    const point = viewportHelpers.clientToCanvas(e.clientX, e.clientY);
    if (!point) return;

    onPointerDownText(point);
  };

  function onPointerDownText(point: Point) {
    handleDrawTextOverFrame(point);

    setTextEditingState({
      type: "text",
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      angle: 0,

      appearance: {
        ...DEFAULT_APPEARANCE.text,
        strokeColor,
      },

      data: {
        text: "",
        fontSize,
        fontFamily,
        textAlign,
        lineHeight: lineHeightMultiplier,
      },

      groupId: null,
      frameId: hoveredFrameId,
      zIndex: "",
      seed: 0,
      version: 0,
      versionNonce: 0,
      updated: 0,
      isDeleted: false,
      locked: false,
      link: null,
    });
  }

  function finishEditingIfClickedOutside() {
    if (!textEditingState) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    saveTextShape();
    setHoveredFrameId(null);
  }

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;

      setTextEditingState((prev) =>
        prev
          ? {
              ...prev,
              data: {
                ...prev.data,
                text: value,
              },
            }
          : null,
      );
    },
    [setTextEditingState],
  );

  const style = useMemo(() => {
    if (!textEditingState) return null;

    const point = viewportHelpers.canvasToClient(
      textEditingState.x,
      textEditingState.y,
    );

    if (!point) return null;

    return {
      position: "fixed" as const,
      left: point.x - 1,
      top: point.y - 4,
      fontSize: `${
        textEditingState.id
          ? textEditingState.data.fontSize * scale
          : textEditingState.data.fontSize
      }px`,
      fontFamily: textEditingState.data.fontFamily,
      color: textEditingState.appearance.strokeColor,
      lineHeight: lineHeightMultiplier,
      textAlign: textEditingState.data.textAlign,
      zIndex: 3,
    };
  }, [textEditingState, scale, lineHeightMultiplier, viewportHelpers]);

  // Closes text-editor if clicked outside
  useEffect(() => {
    if (!textEditingState) return;

    const handleClickOutside = (e: PointerEvent) => {
      if (textareaRef.current?.contains(e.target as Node)) {
        return;
      }

      finishEditingIfClickedOutside();
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [textEditingState, finishEditingIfClickedOutside]);

  return {
    handleKeyDown,
    handleDoubleClick,
    onPointerDownText,
    finishEditingIfClickedOutside,
    style,
    handleChange,
  };
}
