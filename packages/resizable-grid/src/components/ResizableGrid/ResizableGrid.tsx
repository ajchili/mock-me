import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { HOVER_SIZE, ResizableGridDivider } from "./ResizableGridDivider";

export interface ResizableGridProps {
  children?: ReactNode[];
  direction: "horizontal" | "vertical";
}

export const ResizableGrid = (props: ResizableGridProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);
  const [childSizes, setChildSizes] = useState<(number | undefined)[]>(
    Array.from({ length: props.children?.length || 0 }, () => undefined)
  );

  const onResize = useCallback(() => {
    const { current } = containerRef;
    console.log(containerRef);
    if (current === undefined || current === null) {
      return;
    }

    setOffsetLeft(current.offsetLeft);
    setOffsetTop(current.offsetTop);
  }, [containerRef]);

  const onDividerDrag = useCallback(
    (clientX: number, clientY: number, i: number) => {
      setChildSizes((sizes) => {
        sizes[i] =
          (props.direction === "horizontal"
            ? clientX - offsetLeft
            : clientY - offsetTop) - HOVER_SIZE;
        return Array.from(sizes);
      });
    },
    [offsetLeft, offsetTop]
  );

  useLayoutEffect(() => {
    onResize();

    const observer = new ResizeObserver(onResize);
    if (containerRef.current !== null) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: props.direction === "horizontal" ? "row" : "column",
      }}
      onResizeCapture={onResize}
    >
      {props.children?.map((child, i, arr) => {
        const isLastChild = i === arr.length - 1;

        return (
          <>
            <div
              key={`child-${i}`}
              style={{
                flex: childSizes[i] === undefined ? 1 : undefined,
                width:
                  props.direction === "horizontal"
                    ? `${childSizes[i]}px`
                    : undefined,
                height:
                  props.direction === "horizontal"
                    ? undefined
                    : `${childSizes[i]}px`,
              }}
            >
              {child}
            </div>
            {!isLastChild && (
              <ResizableGridDivider
                key={`divider-${i}`}
                direction={props.direction}
                onResize={({ clientX, clientY }) =>
                  onDividerDrag(clientX, clientY, i)
                }
              />
            )}
          </>
        );
      })}
    </div>
  );
};
