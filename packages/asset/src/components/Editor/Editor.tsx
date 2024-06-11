import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor";
import { useStyles } from "./styles.js";

export interface EditorProps {
  language?: string;
  theme?: "vs-light" | "vs-dark";
  options?: Omit<
    monaco.editor.IStandaloneEditorConstructionOptions,
    "language" | "theme"
  >;
}

export const Editor = (props: EditorProps): JSX.Element => {
  const [initialized, setInitialized] = useState(false);
  const [value, setValue] = useState<string | undefined>();
  const [ws, setWebSocket] = useState<WebSocket>();
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);
  const styles = useStyles();

  useEffect(() => {
    if (initialized && value !== undefined) {
      const position = editor?.getPosition();
      editor?.setValue(value);
      if (position) {
        editor?.setPosition(position);
      }
    }
  }, [value]);

  useEffect(() => {
    const _ws = new WebSocket("http://localhost:6969");
    _ws.addEventListener("message", (message) => {
      const { type, data } = JSON.parse(message.data);

      if (type !== "editorValue") {
        return;
      }

      setValue(data);
    });
    setWebSocket(_ws);
  }, []);

  useEffect(() => {
    if (value === undefined || initialized) {
      return;
    }

    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        return monaco.editor.create(monacoEl.current!, {
          value,
          ...props.options,
          language: props.language,
          theme: props.theme,
        });
      });
      setInitialized(true);
    }

    return () => editor?.dispose();
  }, [value, monacoEl.current]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const onDidChangeModelContent = editor.onDidChangeModelContent((e) => {
      if (ws === undefined || ws.readyState !== WebSocket.OPEN) {
        return;
      }

      ws.send(JSON.stringify({ type: "changeModelContent", data: e }));
    });
    const onDidChangeCursorPosition = editor.onDidChangeCursorPosition((e) => {
      if (ws === undefined || ws.readyState !== WebSocket.OPEN) {
        return;
      }

      ws.send(JSON.stringify({ type: "changeCursorPosition", data: e }));
    });

    return () => {
      onDidChangeModelContent.dispose();
      onDidChangeCursorPosition.dispose();
    };
  }, [value, editor]);

  return (
    <div className={styles.container} hidden={initialized}>
      <div className={styles.editor} ref={monacoEl}></div>
    </div>
  );
};
