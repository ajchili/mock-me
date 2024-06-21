import Fastify from "fastify";
import FastifyWebSocket from "@fastify/websocket";
import { EditorManager } from "./editorManager.js";

const editorManagers = {
  question: new EditorManager({
    pollingRate: 10000,
  }),
  candidate: new EditorManager(),
  interviewer: new EditorManager({
    initialValue: "# Interviewer Notes",
    pollingRate: 1000,
  }),
};

const fastify = Fastify({
  logger: true,
});
fastify.register(FastifyWebSocket);
fastify.register(() =>
  fastify.route({
    method: "GET",
    url: "/",
    handler: (_req, reply) => {
      reply.send({ hello: "world" });
    },
    wsHandler: (socket) => {
      const register = (type: keyof typeof editorManagers) => {
        socket.send(
          JSON.stringify({
            type: "editorValue",
            data: {
              type,
              value: editorManagers[type].value,
            },
          })
        );

        editorManagers[type].on("onChange", () => {
          socket.send(
            JSON.stringify({
              type: "editorValue",
              data: {
                type,
                value: editorManagers[type].value,
              },
            })
          );
        });
      };

      socket.on("message", (message: Buffer) => {
        const decodedMessage = Buffer.from(message).toString("utf-8");
        const { type: messageType, data } = JSON.parse(decodedMessage);
        switch (messageType) {
          case "getEditorValue":
            register(data.type);
            break;
          case "changeCursorPosition":
            console.log(data.position.lineNumber + ":" + data.position.column);
            break;
          case "changeModelContent":
            const { type } = data;
            if (type in editorManagers) {
              // @ts-expect-error
              editorManagers[type].enqueueChanges(data.modelContent.changes);
            }
            break;
          default:
            console.log(type, JSON.stringify(data));
            break;
        }
      });
    },
  })
);

fastify.get("/selectDaily", async (req, res) => {
  const dailyQuestionResponse = await fetch(
    "https://alfa-leetcode-api.onrender.com/dailyQuestion"
  );
  const { data } = (await dailyQuestionResponse.json()) as any;
  const { content = "", codeSnippets = [] } =
    data?.activeDailyCodingChallengeQuestion?.question || {};

  editorManagers.question.value = content;
  editorManagers.candidate.value = codeSnippets.find(
    (codeSnippet: any) => codeSnippet.langSlug === "typescript"
  )?.code;

  res.status(200).send();
});

fastify.listen({ host: "0.0.0.0", port: 6969 });
