import { Editor, EditorProps } from "../../components/Editor/Editor.js";
import { useRemoteEditorValue } from "../../hooks/useRemoteEditor.js";

const WEB_SOCKET_READY_STATE_TEXT: Record<number, string> = {
  [WebSocket.CONNECTING]: "Connecting...",
  [WebSocket.OPEN]: "Connected",
  [WebSocket.CLOSING]: "Disconnecting...",
  [WebSocket.CLOSED]: "Disconnected",
};

interface RemoteEditorProps extends Omit<EditorProps, "value" | "onChange"> {
  type: "candidate" | "interviewer";
}

export const RemoteEditor = (props: RemoteEditorProps): JSX.Element => {
  const [{ value, readyState }, dispatch] = useRemoteEditorValue({
    type: props.type,
  });

  if (value === undefined || readyState !== WebSocket.OPEN) {
    return <h1>{WEB_SOCKET_READY_STATE_TEXT[readyState]}</h1>;
  }

  return (
    <Editor
      value={value}
      onChange={(event) => {
        if (readyState !== WebSocket.OPEN) {
          return;
        }

        dispatch({ type: "sendChange", change: event });
      }}
      language={props.language}
      theme={props.theme}
      options={props.options}
    />
  );
};
