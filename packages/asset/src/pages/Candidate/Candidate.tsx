import { Editor } from "../../components/Editor/Editor.js";
import { useRemoteEditorValue } from "../../hooks/useRemoteEditor.js";

export const Candidate = (): JSX.Element => {
  const [{ value, readyState }, dispatch] = useRemoteEditorValue({
    type: "candidate",
  });

  if (value === undefined || readyState !== WebSocket.OPEN) {
    return <h1>loading</h1>;
  }

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <Editor
        value={value}
        onChange={(event) => {
          if (readyState !== WebSocket.OPEN) {
            return;
          }

          dispatch({ type: "sendChange", change: event });
        }}
        language="typescript"
        theme="vs-dark"
        options={{ fontSize: 14, tabSize: 2 }}
      />
    </div>
  );
};
