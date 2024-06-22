import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor";
import { useStyles } from "./styles.js";

// https://github.com/microsoft/monaco-editor/issues/2122#issuecomment-898307500

import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
import "monaco-editor/esm/vs/basic-languages/xml/xml.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";

import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "typescript" || label === "javascript") return new TsWorker();
    if (label === "json") return new JsonWorker();
    if (label === "css") return new CssWorker();
    if (label === "html") return new HtmlWorker();
    return new EditorWorker();
  },
};

export interface EditorProps {
  value: string;
  changes?: monaco.editor.IModelContentChangedEvent["changes"];
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
  const monacoEl = useRef<HTMLDivElement>(null);
  const styles = useStyles();

  editor?.updateOptions({
    ...props.options,
  });

  const resize = () => {
    editor?.layout();
  };

  useEffect(() => {
    // https://github.com/Microsoft/monaco-editor/issues/28#issuecomment-228523529
    window.addEventListener("resize", resize);
    monacoEl.current?.addEventListener("resize", resize);

    return () => {
      monacoEl.current?.removeEventListener("resize", resize);
      window.removeEventListener("resize", resize);
    };
  }, [monacoEl]);

  useEffect(() => {
    editor?.executeEdits("remote", props.changes || []);
  }, [props.changes]);

  useEffect(() => {
    if (editor?.getValue() === props.value) {
      return;
    }

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
          value: props.value,
          // Default options
          fontSize: 14,
          tabSize: 2,
          // Overwritten options
          ...props.options,
          language: props.language,
          theme: props.theme || "vs-dark",
          readOnly: true,
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
  }, [props.value, props.changes, editor]);

  return (
    <div className={styles.container}>
      <div className={styles.editor} ref={monacoEl} />
    </div>
  );
};
