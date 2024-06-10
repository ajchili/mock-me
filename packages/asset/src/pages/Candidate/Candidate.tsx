import { Editor } from "../../components/Editor/Editor.js";

export const Candidate = (): JSX.Element => {
  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <Editor
        language="typescript"
        theme="vs-dark"
        options={{ fontSize: 14, tabSize: 2 }}
      />
    </div>
  );
};
