import { useEffect, useRef } from "react";
import { useRemoteEditor } from "../../hooks/useRemoteEditor.js";

export const QuestionArea = (): JSX.Element => {
  const { value } = useRemoteEditor({
    editorType: "prompt",
  });
  const questionPromptEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!questionPromptEl.current) {
      return;
    }

    questionPromptEl.current.innerHTML = value || "Loading prompt!";
  }, [value, questionPromptEl.current]);

  return <div ref={questionPromptEl}></div>;
};
