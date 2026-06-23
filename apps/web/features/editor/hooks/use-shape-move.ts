import { Dispatch, SetStateAction } from "react";
import { SelectedShapeBounds, Shape } from "../types/types";
import { getBoundingBox } from "../geometry/bounding-box";

export default function useShapeMove({
  setShapes,
  setSelectedShape,
  setSelectedShapeBounds,
}: {
  setShapes: Dispatch<SetStateAction<Shape[]>>;
  setSelectedShape: Dispatch<SetStateAction<Shape | null>>;
  setSelectedShapeBounds: Dispatch<SetStateAction<SelectedShapeBounds | null>>;
}) {
  const moveShape = ({
    selectedShape,
    dx,
    dy,
  }: {
    selectedShape: Shape;
    dx: number;
    dy: number;
  }) => {
    const updatedShape = {
      ...selectedShape,
      x: selectedShape.x + dx,
      y: selectedShape.y + dy,
    };

    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === selectedShape.id ? updatedShape : shape,
      ),
    );

    setSelectedShape(updatedShape);
    setSelectedShapeBounds(getBoundingBox(updatedShape));
  };

  // Moves the page up and down and left and right
  // useEffect(() => {
  //   const handleWheel = (e: WheelEvent) => {
  //     if (!e.ctrlKey) {
  //       dispatch(
  //         setPanOffset({
  //           x: panOffset.x - e.deltaX,
  //           y: panOffset.y - e.deltaY,
  //         }),
  //       );
  //     }

  //     if (e.shiftKey) {
  //       dispatch(
  //         setPanOffset({
  //           x: panOffset.x - e.deltaY,
  //           y: panOffset.y - e.deltaX,
  //         }),
  //       );
  //     }
  //   };

  //   window.addEventListener("wheel", handleWheel, {
  //     passive: true,
  //   });

  //   return () => {
  //     window.removeEventListener("wheel", handleWheel);
  //   };
  // }, [dispatch, panOffset]);

  return { moveShape };
}
