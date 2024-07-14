import { Editor } from "../../components/Editor/Editor.js";
import { Prompt } from "../../components/Prompt/Prompt.js";

export const Candidate = (): JSX.Element => {
  return (
    <div className="flex w-full h-dvh flex-row">
      <Prompt />
      <Editor room="response" language="typescript" />
    </div>
  );
};
