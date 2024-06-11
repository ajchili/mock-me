import { useEffect, useRef, useState } from "react";

export const QuestionArea = (): JSX.Element => {
  const [value, setValue] = useState(`Loading prompt!`);
  const questionPromptEl = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket>();

  if (!wsRef.current) {
    wsRef.current = new WebSocket("http://localhost:6969");
  }

  const onOpen = () => {
    wsRef.current?.send(
      JSON.stringify({
        type: "register",
        data: {
          type: "question",
        },
      })
    );
  };
  const onMessage = (messageEvent: MessageEvent<any>) => {
    const { type: messageType, data } = JSON.parse(messageEvent.data);

    if (messageType !== "editorValue") {
      return;
    } else if (data.type !== "question") {
      return;
    }

    setValue(data.value);
  };

  useEffect(() => {
    wsRef.current?.addEventListener("open", onOpen);
    wsRef.current?.addEventListener("message", onMessage);

    return () => {
      wsRef.current?.removeEventListener("open", onOpen);
      wsRef.current?.removeEventListener("message", onMessage);
      wsRef.current?.close();
    };
  }, [wsRef.current]);

  useEffect(() => {
    if (!questionPromptEl.current) {
      return;
    }

    questionPromptEl.current.innerHTML = value;
  }, [value, questionPromptEl.current]);

  return <div ref={questionPromptEl}></div>;
};
