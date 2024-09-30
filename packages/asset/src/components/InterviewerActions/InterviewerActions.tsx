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
    const { difficulty, question } = await LeetCodeApi.getQuestionByTitleSlug(
      titleSlug
    );

    writeToDoc("response", "function solution() {\n\t\n}");
    writeToDoc(
      "prompt",
      `<div class="flex gap-1"><a href="https://leetcode.com/problems/${titleSlug}" target="_blank">${titleSlug}</a><span class="difficulty-badge ${difficulty.toLowerCase()}">${difficulty}</span></div><hr/>${question}`
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
