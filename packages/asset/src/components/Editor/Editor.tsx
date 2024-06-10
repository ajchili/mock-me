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
// TODO: do this better
const ws = new WebSocket("http://localhost:6969");
ws.onopen = () => {
  ws.send("hello, world");
};

export const Editor = (props: EditorProps): JSX.Element => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);
  const styles = useStyles();

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        return monaco.editor.create(monacoEl.current!, {
          value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
            "\n"
          ),
          ...props.options,
          language: props.language,
          theme: props.theme,
        });
      });
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const onDidChangeModelContent = editor.onDidChangeModelContent(() => {
      // TODO: Submit changes to server
    });
    const onDidChangeCursorPosition = editor.onDidChangeCursorPosition(() => {
      // TODO: Submit cursor position to server
    });

    return () => {
      onDidChangeModelContent.dispose();
      onDidChangeCursorPosition.dispose();
    };
  }, [editor]);

  return (
    <div className={styles.container}>
      <div className={styles.editor} ref={monacoEl}></div>
    </div>
  );
};
