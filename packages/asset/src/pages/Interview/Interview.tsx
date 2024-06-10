import { Editor } from "../../components/Editor/Editor.js";

export const Interview = (): JSX.Element => {
  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <Editor
        language="typescript"
        theme="vs-dark"
        options={{ fontSize: 14, tabSize: 2 }}
      />
      <Editor
        language="markdown"
        theme="vs-dark"
        options={{ fontSize: 14, tabSize: 2 }}
      />
    </div>
  );
};
