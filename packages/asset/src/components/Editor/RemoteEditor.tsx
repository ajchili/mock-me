import { Editor, EditorProps } from "../../components/Editor/Editor.js";
import { useRemoteEditorValue } from "../../hooks/useRemoteEditor.js";

interface RemoteEditorProps extends Omit<EditorProps, "value" | "onChange"> {
  type: "candidate" | "interviewer" | "question";
}

export const RemoteEditor = (props: RemoteEditorProps): JSX.Element => {
  const [{ value, readyState }, dispatch] = useRemoteEditorValue({
    type: props.type,
  });
  const isReady = value !== undefined && readyState === WebSocket.OPEN;

  return (
    <Editor
      value={value || "Loading..."}
      onChange={(event) => {
        if (readyState !== WebSocket.OPEN) {
          return;
        }

        dispatch({ type: "sendChange", change: event });
      }}
      language={props.language}
      theme={props.theme}
      options={{
        ...props.options,
        readOnly: !isReady,
      }}
    />
  );
};
