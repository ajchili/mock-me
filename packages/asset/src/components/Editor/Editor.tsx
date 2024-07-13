import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
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
  room: string;
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
    if (initialized) {
      return;
    }

    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        const newEditor = monaco.editor.create(monacoEl.current!, {
          // Default options
          fontSize: 14,
          tabSize: 2,
          // Overwritten options
          ...props.options,
          language: props.language,
          theme: props.theme || "vs-dark",
        });

        const ydoc = new Y.Doc();
        const { hostname } = window.location;
        const provider = new WebsocketProvider(
          `ws://${hostname}:1234`,
          props.room,
          ydoc
        );
        const type = ydoc.getText("monaco");
        const monacoBinding = new MonacoBinding(
          type,
          // @ts-expect-error
          newEditor.getModel(),
          new Set([newEditor]),
          provider.awareness
        );

        return newEditor;
      });
      setInitialized(true);
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  return (
    <div className={styles.container}>
      <div className="flex-1" ref={monacoEl} />
    </div>
  );
};
