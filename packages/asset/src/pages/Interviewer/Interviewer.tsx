import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

import { Editor } from "../../components/Editor/Editor.js";
import { TabPane } from "../../components/TabPane/TabPane.js";
import { Prompt } from "../../components/Prompt/Prompt.js";
import { Button } from "../../components/Button/Button.js";

export const Interviewer = (): JSX.Element => {
  const writeToDoc = (room: string, content: string) => {
    const ydoc = new Y.Doc();
    const { hostname } = window.location;
    const provider = new WebsocketProvider(`ws://${hostname}:1234`, room, ydoc);

    ydoc.getText("monaco").delete(0, ydoc.getText("monaco").length);
    ydoc.getText("monaco").insert(0, content);
    // Disconnect after assuming that delete and insert were successful
    setTimeout(() => provider.destroy(), 1000);
  };

  const selectDailyQuestion = async () => {
    const response = await fetch(
      `http://${window.location.hostname}:3000/dailyQuestion`
    );
    const { data } = await response.json();
    const { question } = data.activeDailyCodingChallengeQuestion;

    writeToDoc(
      "response",
      question.codeSnippets.find(
        ({ langSlug }: any) => langSlug === "typescript"
      )?.code
    );
    writeToDoc(
      "prompt",
      `<div class="flex gap-1"><a href="https://leetcode.com/problems/${
        question.titleSlug
      }" target="_blank">${
        question.titleSlug
      }</a><span class="difficulty-badge ${question.difficulty.toLowerCase()}">${
        question.difficulty
      }</span></div><hr/>${question.content}`
    );
  };

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
              children: (
                <div>
                  <Button onClick={selectDailyQuestion}>
                    Select Daily Question
                  </Button>
                </div>
              ),
            },
          ]}
        />
        <Editor room="notes" language="markdown" options={{ wordWrap: "on" }} />
      </div>
    </div>
  );
};
