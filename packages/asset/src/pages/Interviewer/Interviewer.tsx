import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { Editor } from "../../components/Editor/Editor.js";
import { TabPane } from "../../components/TabPane/TabPane.js";
import { Prompt } from "../../components/Prompt/Prompt.js";
import { InterviewerActions } from "../../components/InterviewerActions/InterviewerActions.js";
import { Navbar } from "../../components/Navbar/Navbar.js";

export const Interviewer = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full h-dvh w-max-[100%]">
      <Navbar />
      <PanelGroup
        autoSaveId="interviewer"
        className="flex w-full"
        direction="horizontal"
      >
        <Panel className="flex flex-1" minSize={40}>
          <Editor
            type="response"
            language="typescript"
            options={{ wordWrap: "on" }}
          />
        </Panel>
        <PanelResizeHandle />
        <Panel className="flex flex-1" minSize={40}>
          <PanelGroup
            className="flex flex-1 flex-col"
            autoSaveId="interviewer-details"
            direction="vertical"
          >
            <Panel className="flex flex-1" minSize={20}>
              <TabPane
                tabs={[
                  {
                    title: "Prompt Viewer",
                    children: <Prompt />,
                  },
                  {
                    title: "Prompt Editor",
                    children: (
                      <Editor
                        type="prompt"
                        language="html"
                        options={{ wordWrap: "on" }}
                      />
                    ),
                  },
                  {
                    title: "Interviewer Actions",
                    children: <InterviewerActions />,
                  },
                ]}
              />
            </Panel>
            <PanelResizeHandle />
            <Panel className="flex flex-1" minSize={40}>
              <Editor
                language="markdown"
                type="notes"
                options={{ wordWrap: "on" }}
              />
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};
