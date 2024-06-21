import { useEffect, useRef } from "react";
import { RegisterMessage } from "@mock-me/messages";
import { RemoteEditor } from "../../components/Editor/RemoteEditor.js";
import { QuestionArea } from "../../components/QuestionArea/QuestionArea.js";
import { SocketProvider } from "../../providers/socketProvider.js";

export const Candidate = (): JSX.Element => {
  const wsRef = useRef<WebSocket>();

  if (!wsRef.current) {
    const query = new URLSearchParams(window.location.search);
    wsRef.current = new WebSocket(`${query.get("endpoint")}:6969`);
  }

  const onOpen = () => {
    wsRef.current?.send(
      JSON.stringify({
        type: "REGISTER",
        data: { participant: "candidate" },
      } as RegisterMessage)
    );
  };

  useEffect(() => {
    wsRef.current?.addEventListener("open", onOpen);

    return () => {
      wsRef.current?.removeEventListener("open", onOpen);
      wsRef.current?.close();
    };
  }, [wsRef.current]);

  return (
    <SocketProvider webSocket={wsRef.current}>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <QuestionArea />
        <div style={{ flex: 1 }}>
          <RemoteEditor editorType="response" language="typescript" />
        </div>
      </div>
    </SocketProvider>
  );
};
