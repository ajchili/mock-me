import { RemoteEditor } from "../../components/Editor/RemoteEditor.js";

export const Candidate = (): JSX.Element => {
  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <RemoteEditor type="candidate" language="typescript" />
    </div>
  );
};
