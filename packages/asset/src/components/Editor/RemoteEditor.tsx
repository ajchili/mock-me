import type { EditorType } from "@mock-me/messages";
import { Editor, EditorProps } from "../../components/Editor/Editor.js";
import { useRemoteEditor } from "../../hooks/useRemoteEditor.js";

interface RemoteEditorProps extends Omit<EditorProps, "value" | "onChange"> {
  editorType: EditorType;
}

export const RemoteEditor = (props: RemoteEditorProps): JSX.Element => {
  const { value, connected, sendChanges, changes } = useRemoteEditor({
    editorType: props.editorType,
  });

  return (
    <Editor
      value={value ?? "Loading..."}
      changes={changes}
      onChange={(event) => {
        if (!connected) {
          return;
        }

        sendChanges(event.changes);
      }}
      language={props.language}
      theme={props.theme}
      options={{
        ...props.options,
        readOnly: !connected,
      }}
    />
  );
};
