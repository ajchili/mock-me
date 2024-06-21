import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket.js";

export const QuestionArea = (): JSX.Element => {
  const [value, setValue] = useState(`Loading prompt!`);
  const questionPromptEl = useRef<HTMLDivElement>(null);
  const query = new URLSearchParams(window.location.search);
  const webSocket = useWebSocket(`${query.get("endpoint")}:6969`);

  const onOpen = () => {
    webSocket?.send(
      JSON.stringify({
        type: "getEditorValue",
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
    webSocket.addEventListener("open", onOpen);
    webSocket.addEventListener("message", onMessage);

    return () => {
      webSocket.removeEventListener("open", onOpen);
      webSocket.removeEventListener("message", onMessage);
    };
  }, [webSocket]);

  useEffect(() => {
    if (!questionPromptEl.current) {
      return;
    }

    questionPromptEl.current.innerHTML = value;
  }, [value, questionPromptEl.current]);

  return <div ref={questionPromptEl}></div>;
};
