import { useEffect, useRef, useState } from "react";
import { RegisterMessage } from "@mock-me/messages";
import { Editor } from "../../components/Editor/Editor.js";
import { useStyles } from "./styles.js";
import { SocketProvider } from "../../providers/socketProvider.js";

const TABS = ["Question", "Actions"];

export const Interviewer = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  const styles = useStyles();
  const wsRef = useRef<WebSocket>();

  if (!wsRef.current) {
    const { hostname } = window.location;
    wsRef.current = new WebSocket(`ws://${hostname}:6969`);
  }

  const onOpen = () => {
    wsRef.current?.send(
      JSON.stringify({
        type: "REGISTER",
        data: { participant: "interviewer" },
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexShrink: 1,
            minHeight: 200,
            maxHeight: 200,
          }}
        >
          <div className={styles.tabContainer}>
            {TABS.map((tab, tabIndex) => {
              return (
                <button
                  key={`${tab}-tab`}
                  className={styles.tab}
                  onClick={() => setActiveTab(tabIndex)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          {activeTab === 0 && (
            <Editor
              room="prompt"
              language="html"
              options={{ wordWrap: "on" }}
            />
          )}
          {activeTab === 1 && (
            <>
              <h2>Interviewer Actions</h2>
              <button
                onClick={() => {
                  const { hostname } = window.location;
                  fetch(`http://${hostname}:6969/selectDaily`);
                }}
              >
                Load Daily Question
              </button>
            </>
          )}
        </div>
        <div style={{ flex: 1, display: "flex" }}>
          <div style={{ flex: 1 }}>
            <Editor
              room="response"
              language="typescript"
              options={{ wordWrap: "on" }}
            />
          </div>
          <div style={{ display: "flex", flex: 1 }}>
            <div style={{ flex: 6 }}>
              <Editor
                room="notes"
                language="markdown"
                options={{ wordWrap: "on" }}
              />
            </div>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
};
