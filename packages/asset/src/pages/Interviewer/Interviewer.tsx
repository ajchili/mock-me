import { Editor } from "../../components/Editor/Editor.js";
import { TabPane } from "../../components/TabPane/TabPane.js";
import { Prompt } from "../../components/Prompt/Prompt.js";
import { InterviewerActions } from "../../components/InterviewerActions/InterviewerActions.js";

export const Interviewer = (): JSX.Element => {
  return (
    <div className="flex w-full h-dvh">
      <Editor
        room="response"
        language="typescript"
        options={{ wordWrap: "on" }}
      />
      <div className="flex flex-1 flex-col">
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
                  room="prompt"
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
        <Editor room="notes" language="markdown" options={{ wordWrap: "on" }} />
      </div>
    </div>
  );
};
