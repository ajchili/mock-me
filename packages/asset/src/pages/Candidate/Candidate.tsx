import { RemoteEditor } from "../../components/Editor/RemoteEditor.js";
import { QuestionArea } from "../../components/QuestionArea/QuestionArea.js";

export const Candidate = (): JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <QuestionArea />
      <div style={{ flex: 1 }}>
        <RemoteEditor type="candidate" language="typescript" />
      </div>
    </div>
  );
};
