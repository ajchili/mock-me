import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor";
import { useStyles } from "./styles.js";

export interface EditorProps {
  value: string;
  onChange?: (event: monaco.editor.IModelContentChangedEvent) => void;
  language?: string;
  theme?: "vs-light" | "vs-dark";
  options?: Omit<
    monaco.editor.IStandaloneEditorConstructionOptions,
    "language" | "theme"
  >;
}

export const Editor = (props: EditorProps): JSX.Element => {
  const [initialized, setInitialized] = useState(false);
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);
  const styles = useStyles();

  useEffect(() => {
    const position = editor?.getPosition();
    editor?.setValue(props.value);
    if (position) {
      editor?.setPosition(position);
    }
  }, [props.value]);

  useEffect(() => {
    if (initialized) {
      return;
    }

    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        return monaco.editor.create(monacoEl.current!, {
          automaticLayout: true,
          value: props.value,
          // Default options
          fontSize: 14,
          tabSize: 2,
          // Overwritten options
          ...props.options,
          language: props.language,
          theme: props.theme || "vs-dark",
        });
      });
      setInitialized(true);
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const onDidChangeModelContent = editor.onDidChangeModelContent((event) =>
      props.onChange?.(event)
    );

    return () => {
      onDidChangeModelContent.dispose();
    };
  }, [props.value, editor]);

  return (
    <div className={styles.container} hidden={initialized}>
      <div className={styles.editor} ref={monacoEl}></div>
    </div>
  );
};
