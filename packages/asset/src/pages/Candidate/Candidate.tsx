import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Editor } from "../../components/Editor/Editor.js";
import { Navbar } from "../../components/Navbar/Navbar.js";
import { Prompt } from "../../components/Prompt/Prompt.js";

export const Candidate = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full h-dvh max-h-dvh w-max-[100%]">
      <Navbar />
      <PanelGroup
        autoSaveId="candidate"
        className="flex flex-1"
        direction="horizontal"
      >
        <Panel className="flex flex-1" minSize={20}>
          <Prompt />
        </Panel>
        <PanelResizeHandle />
        <Panel className="flex flex-1" minSize={40}>
          <Editor type="response" language="typescript" />
        </Panel>
      </PanelGroup>
    </div>
  );
};
