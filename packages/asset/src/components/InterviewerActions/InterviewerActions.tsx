import * as Y from "yjs";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "../Button/Button.js";
import { buildWebsocketProvider } from "../../providers/websocket.js";
import { LeetCodeApi } from "../../api/leetcode.js";

export const InterviewerActions = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roomId = searchParams.get("roomId");
  if (!roomId) {
    navigate("/");
    return;
  }

  const writeToDoc = (doc: string, content: string) => {
    const ydoc = new Y.Doc();
    const provider = buildWebsocketProvider(roomId, ydoc);

    ydoc.getText(doc).delete(0, ydoc.getText(doc).length);
    ydoc.getText(doc).insert(0, content);
    // Disconnect after assuming that delete and insert were successful
    setTimeout(() => provider.destroy(), 1000);
  };

  const loadQuestion = async (titleSlug: string) => {
    const { codeSnippets, difficulty, exampleTestcases, hints, question } =
      await LeetCodeApi.getQuestionByTitleSlug(titleSlug);

    // All of the below code is very stinky. But it kind of works!
    const codeSnippet =
      codeSnippets.find(
        (codeSnippet: any) => codeSnippet.langSlug === "javascript"
      )?.code ?? "// Your solution";

    const { functionName } =
      /((?<functionName>\w+) = function)/.exec(codeSnippet)?.groups ?? {};
    console.log(functionName);

    const response = [
      codeSnippet,
      "/** You can assume all code below this line works and that you do not need to modify it **/",
      `const testCases = [${exampleTestcases.split("\n").join(",")}]`,
      // This does not work when the function takes multiple arguments
      `testCases.forEach(testCase => console.log(${functionName}(testCase)))`,
    ].join("\n\n\n");

    writeToDoc("response", response);
    writeToDoc(
      "prompt",
      `<div class="flex gap-1"><a href="https://leetcode.com/problems/${titleSlug}" target="_blank">${titleSlug}</a><span class="difficulty-badge ${difficulty.toLowerCase()}">${difficulty}</span></div><hr/>${question}`
    );
    writeToDoc(
      "notes",
      [
        "## Notes",
        "Write your notes here!",
        "## Hints",
        "> Consider giving hints to the candidate if they are struggling",
        hints.map((hint: string) => `- ${hint}`).join("\n"),
      ].join("\n\n")
    );
  };

  const selectDailyQuestion = async () => {
    const { data } = await LeetCodeApi.getDailyQuestion();

    await loadQuestion(
      data.activeDailyCodingChallengeQuestion.question.titleSlug
    );
  };

  const selectQuestion = async () => {
    const titleSlug = prompt(
      'Select LeetCode question. Please provide the slug (e.g. "two-sum").'
    );

    if (titleSlug) {
      await loadQuestion(titleSlug);
    }
  };

  const selectRandomQuestion = async () => {
    const { problemsetQuestionList } = await LeetCodeApi.getRandomQuestion();

    await loadQuestion(problemsetQuestionList[0].titleSlug);
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto px-4 py-5">
      <div>
        <h1 className="text-xl">LeetCode</h1>
        <Button onClick={selectDailyQuestion}>Select Daily Question</Button>
        <Button onClick={selectRandomQuestion}>Select Random Question</Button>
        <Button onClick={selectQuestion}>Select Question by Title Slug</Button>
      </div>
    </div>
  );
};
