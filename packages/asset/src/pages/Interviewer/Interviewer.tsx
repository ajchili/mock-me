import { RemoteEditor } from "../../components/Editor/RemoteEditor.js";

export const Interviewer = (): JSX.Element => {
  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <div style={{ flex: 1 }}>
        <RemoteEditor type="candidate" language="typescript" />
      </div>
      <div style={{ flex: 1 }}>
        <RemoteEditor type="interviewer" language="markdown" />
      </div>
    </div>
  );
};
