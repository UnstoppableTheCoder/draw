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
import { Point, Shape, TextShape } from "../../types";
import { createBaseShape, DEFAULT_APPEARANCE } from "../draw/create-shape";
import { getNextZIndex } from "../../utils/shape-z-index";
import { useParams } from "next/navigation";
import { useUser } from "@/features/auth/store/selectors";
import {
  createShapes,
  deleteShapes,
  updateShapes,
} from "../../networking/api/shape-api";

export default function useTextEditing(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
  const { pageId } = useParams<{ pageId: string }>();
  const user = useUser();

  const setSelectedTool = store.useSetSelectedTool();
  const setShapes = store.useSetShapes();
  const shapes = store.useShapes();
  const setTextEditingState = store.useSetTextEditingState();
  const textEditingState = store.useTextEditingState();
  const scale = store.useScale();
  const selectedTool = store.useSelectedTool();
  const setHoveredFrameId = store.useSetHoveredFrameId();
  const hoveredFrameId = store.useHoveredFrameId();
  const pushHistory = store.usePushHistory();

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

  const saveTextShape = async () => {
    if (!textEditingState) return;

    const text = textEditingState.data.text.trim();

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const previousShapes = shapes;
    let nextShapes = previousShapes;

    try {
      // Editing an existing shape
      if (textEditingState.id) {
        if (!text) {
          nextShapes = previousShapes.filter(
            (shape) => shape.id !== textEditingState.id,
          );

          setShapes(nextShapes);
          pushHistory();

          finishTextEditing();
          invalidate();

          await deleteShapes(pageId, [textEditingState.id]);
          return;
        }

        const updatedShape = buildUpdatedTextShape(
          previousShapes,
          textEditingState.id,
          text,
          ctx,
        );

        if (!updatedShape) return;

        nextShapes = previousShapes.map((shape) =>
          shape.id === updatedShape.id ? updatedShape : shape,
        );

        setShapes(nextShapes);
        pushHistory();

        finishTextEditing();
        invalidate();

        await updateShapes(pageId, [updatedShape]);
        return;
      }

      // Creating a new shape
      if (!text) {
        finishTextEditing();
        return;
      }

      const newShape = createTextShape(textEditingState, text, ctx);
      nextShapes = [...previousShapes, newShape];

      setShapes(nextShapes);
      pushHistory();

      finishTextEditing();
      invalidate();

      await createShapes(pageId, [newShape]);
    } catch (error) {
      console.error(error);

      // Roll back optimistic update
      setShapes(previousShapes);
      invalidate();
    }
  };

  function finishTextEditing() {
    setTextEditingState(null);
    setSelectedTool("select");
  }

  function buildUpdatedTextShape(
    shapes: Shape[],
    id: string,
    text: string,
    ctx: CanvasRenderingContext2D,
  ): TextShape | null {
    const shape = shapes.find(
      (shape): shape is TextShape => shape.id === id && shape.type === "text",
    );

    if (!shape) return null;

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
  }

  function createTextShape(
    editingState: NonNullable<typeof textEditingState>,
    text: string,
    ctx: CanvasRenderingContext2D,
  ): TextShape {
    const { width, height } = getTextDimensions({
      ctx,
      text,
      fontSize,
      fontFamily,
    });

    const lastShapeZIndex = shapes.at(-1)?.zIndex!;
    const zIndex = getNextZIndex(lastShapeZIndex);

    return createBaseShape(
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
      pageId,
      user!.id,
    );
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
      seed: 0,
      version: 0,
      versionNonce: 0,
      isDeleted: false,
      locked: false,
      link: null,
      pageId,
      createdById: user!.id,
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
