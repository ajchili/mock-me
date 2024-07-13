import { Editor } from "../../components/Editor/Editor.js";
import { Prompt } from "../../components/Prompt/Prompt.js";

export const Candidate = (): JSX.Element => {
  return (
    <div className="flex w-full h-dvh flex-row">
      <Prompt />
      <div className="flex-1">
        <Editor room="response" language="typescript" />
      </div>
    </div>
  );
};
