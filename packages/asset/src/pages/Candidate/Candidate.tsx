import { Editor } from "../../components/Editor/Editor.js";
import { Navbar } from "../../components/Navbar/Navbar.js";
import { Prompt } from "../../components/Prompt/Prompt.js";

export const Candidate = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full h-dvh max-h-dvh">
      <Navbar />
      <div className="flex w-full flex-grow">
        <Prompt />
        <Editor type="response" language="typescript" />
      </div>
    </div>
  );
};
