import { useEffect, useRef, useState } from "react";
import { useRemoteEditor } from "../../hooks/useRemoteEditor.js";
import { useStyles } from "./styles.js";

export const QuestionArea = (): JSX.Element => {
  const [height, setHeight] = useState(200);
  const [isDragging, setIsDragging] = useState(false);
  const { value } = useRemoteEditor({
    editorType: "prompt",
  });
  const styles = useStyles();
  const questionPromptEl = useRef<HTMLDivElement>(null);

  const onDraggableMouseDown = (event: MouseEvent) => {
    if (
      (event.target as HTMLElement | null)?.classList.contains(
        styles.draggableItem
      )
    ) {
      setIsDragging(true);
    }
  };

  const onDraggableMouseUp = () => {
    setIsDragging(false);
  };

  const updateMaxHeight = (event: MouseEvent) => {
    const minHeight = document.body.clientHeight / 10;
    const maxHeight = document.body.clientHeight / 2;
    const newHeight = Math.min(Math.max(event.clientY, minHeight), maxHeight);
    setHeight(newHeight);
  };

  useEffect(() => {
    document.addEventListener("mousedown", onDraggableMouseDown);
    document.addEventListener("mouseup", onDraggableMouseUp);

    return () => {
      document.removeEventListener("mousedown", onDraggableMouseDown);
      document.removeEventListener("mouseup", onDraggableMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!questionPromptEl.current) {
      return;
    }

    questionPromptEl.current.innerHTML = value || "Loading prompt!";
  }, [value, questionPromptEl.current]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", updateMaxHeight);
    }
    document.body.style.cursor = isDragging ? "ns-resize" : "auto";

    return () => {
      document.removeEventListener("mousemove", updateMaxHeight);
    };
  }, [isDragging]);

  return (
    <>
      <div
        style={{
          maxHeight: height,
          height,
          minHeight: height,
          overflowY: "scroll",
        }}
        ref={questionPromptEl}
      />
      <div className={styles.draggableItem} />
    </>
  );
};
