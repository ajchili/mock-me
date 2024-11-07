import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

export const HOVER_SIZE = 4;

export interface ResizableGridDividerProps {
  direction: "horizontal" | "vertical";
  onResize?: (position: { clientX: number; clientY: number }) => void;
}

export const ResizableGridDivider = (
  props: ResizableGridDividerProps
): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [click, setClick] = useState(false);
  const [hover, setHover] = useState(false);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e;
      props.onResize?.({ clientX, clientY });
    },
    [props.onResize]
  );

  useLayoutEffect(() => {
    if (click) {
      document.addEventListener("mousemove", onMouseMove);

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
      };
    }
  }, [click]);

  return (
    <div
      ref={ref}
      style={{
        border: `${hover ? HOVER_SIZE : 2}px solid black`,
      }}
      onMouseDown={() => setClick(true)}
      onMouseUp={() => setClick(false)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    />
  );
};
