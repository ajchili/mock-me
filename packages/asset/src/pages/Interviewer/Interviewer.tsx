import { Editor } from "../../components/Editor/Editor.js";
import { useRemoteEditorValue } from "../../hooks/useRemoteEditor.js";

export const Interviewer = (): JSX.Element => {
  const [{ value: candidateValue, readyState: candidateReadyState }, dispatchCandidate] =
    useRemoteEditorValue({
      type: "candidate",
    });
  const [
    { value: interviewerValue, readyState: interviewerReadyState },
    dispatchInterviewer,
  ] = useRemoteEditorValue({
    type: "interviewer",
  });

  if (
    candidateValue === undefined ||
    interviewerValue === undefined ||
    candidateReadyState !== WebSocket.OPEN ||
    interviewerReadyState !== WebSocket.OPEN
  ) {
    return <h1>loading</h1>;
  }
  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <Editor
        value={candidateValue}
        onChange={(event) => {
          if (candidateReadyState !== WebSocket.OPEN) {
            return;
          }

          dispatchCandidate({ type: "sendChange", change: event });
        }}
        language="typescript"
        theme="vs-dark"
        options={{ fontSize: 14, tabSize: 2 }}
      />
      <Editor
        value={interviewerValue}
        onChange={(event) => {
          if (interviewerReadyState !== WebSocket.OPEN) {
            return;
          }

          dispatchInterviewer({ type: "sendChange", change: event });
        }}
        language="markdown"
        theme="vs-dark"
        options={{ fontSize: 14, tabSize: 2 }}
      />
    </div>
  );
};
