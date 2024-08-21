import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

import { Button } from "../Button/Button.js";

export const InterviewerActions = () => {
  const writeToDoc = (room: string, content: string) => {
    const ydoc = new Y.Doc();
    const { hostname } = window.location;
    const provider = new WebsocketProvider(`ws://${hostname}:1234`, room, ydoc);

    ydoc.getText("monaco").delete(0, ydoc.getText("monaco").length);
    ydoc.getText("monaco").insert(0, content);
    // Disconnect after assuming that delete and insert were successful
    setTimeout(() => provider.destroy(), 1000);
  };

  const loadQuestion = async (titleSlug: string) => {
    const response = await fetch(
      `http://${window.location.hostname}:1234/api/leetcode/select?titleSlug=${titleSlug}`
    );
    const { difficulty, question } = await response.json();

    writeToDoc("response", "function solution() {\n\t\n}");
    writeToDoc(
      "prompt",
      `<div class="flex gap-1"><a href="https://leetcode.com/problems/${titleSlug}" target="_blank">${titleSlug}</a><span class="difficulty-badge ${difficulty.toLowerCase()}">${difficulty}</span></div><hr/>${question}`
    );
  };

  const selectDailyQuestion = async () => {
    const response = await fetch(
      `http://${window.location.hostname}:1234/api/leetcode/dailyQuestion`
    );
    const { data } = await response.json();

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
    // Pending: https://github.com/alfaarghya/alfa-leetcode-api/pull/27
    const response = await fetch(
      `http://${
        window.location.hostname
      }:1234/api/leetcode/problems?limit=2&skip=${Math.floor(
        Math.random() * 3219
      )}`
    );
    const { problemsetQuestionList } = await response.json();

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
