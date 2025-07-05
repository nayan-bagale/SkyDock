import {
  LAST_POSITION_DEBOUNCE_TIME,
  X_POSITION,
  Y_POSITION,
} from "@/constants";
import { useCallback, useEffect, useState } from "react";
import { useDebounce, useUnmount } from "react-use";

export const useDrag = ({
  ref,
  calculateFor = "topLeft",
  lastPosition,
  onChangePosition,
}: {
  ref: any;
  calculateFor?: string;
  lastPosition?: { x: number; y: number };
  onChangePosition?: (position: { x: number; y: number }) => void;
}) => {
  const [dragInfo, setDragInfo] = useState<any>();
  const [finalPosition, setFinalPosition] = useState<{ x: number; y: number }>({
    x: X_POSITION,
    y: Y_POSITION + 24,
  });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const observe = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === ref.current) {
          const { height, width } = entry.contentRect;
          setFinalPosition({
            x: window.innerWidth / 2 - width / 2,
            y: window.innerHeight / 2 - height / 2 - 100,
          });
        }
      }
    });

    if (!lastPosition) {
      observe.observe(ref.current);
    } else {
      setFinalPosition(lastPosition);
    }
    setTimeout(() => {
      observe.disconnect();
    }, 100);

    // return () => {
    //   clearTimeout(timer);
    // };
  }, []);

  const updateFinalPosition = useCallback(
    (width: number, height: number, x: number, y: number) => {
      if (calculateFor === "bottomRight") {
        setFinalPosition({
          x: Math.max(
            Math.min(
              window.innerWidth - width,
              window.innerWidth - (x + width)
            ),
            0
          ),
          y: Math.max(
            Math.min(
              window.innerHeight - height,
              window.innerHeight - (y + height)
            ),
            0
          ),
        });

        return;
      }

      setFinalPosition({
        x: Math.min(Math.max(0, x), window.innerWidth - width),
        y:
          Math.min(Math.max(0, y), window.innerHeight - height) <= 24
            ? 24
            : Math.min(Math.max(0, y), window.innerHeight - height),
      });
    },
    [calculateFor]
  );

  const handleMouseUp = (evt: any) => {
    evt.preventDefault();

    setIsDragging(false);
  };

  const handleMouseDown = (evt: any) => {
    evt.preventDefault();

    const { clientX, clientY } = evt;
    const { current: draggableElement } = ref;

    if (!draggableElement) {
      return;
    }

    const { top, left, width, height } =
      draggableElement.getBoundingClientRect();

    setIsDragging(true);
    setDragInfo({
      startX: clientX,
      startY: clientY,
      top,
      left,
      width,
      height: height,
    });
  };

  const handleMouseMove = useCallback(
    (evt: any) => {
      const { current: draggableElement } = ref;

      if (!isDragging || !draggableElement) return;

      evt.preventDefault();

      const { clientX, clientY } = evt;

      const position = {
        x: dragInfo.startX - clientX,
        y: dragInfo.startY - clientY,
      };

      const { top, left, width, height } = dragInfo;

      updateFinalPosition(width, height, left - position.x, top - position.y);
    },
    [isDragging, dragInfo, ref, updateFinalPosition]
  );

  const recalculate = (width: number, height: number) => {
    const { current: draggableElement } = ref;
    const {
      top,
      left,
      width: boundingWidth,
      height: boundingHeight,
    } = draggableElement.getBoundingClientRect();

    updateFinalPosition(
      width ?? boundingWidth,
      height ?? boundingHeight,
      left,
      top
    );
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  const initialPosition = (lastPosition: { x: number; y: number }) => {
    setFinalPosition({
      x: lastPosition.x,
      y: lastPosition.y,
    });
  };

  useDebounce(
    () => {
      onChangePosition?.(finalPosition);
    },
    LAST_POSITION_DEBOUNCE_TIME,
    [finalPosition]
  );

  useUnmount(() => onChangePosition?.({ x: 0, y: 0 }));

  return {
    position: finalPosition,
    handleMouseDown,
    recalculate,
    initialPosition,
  };
};
