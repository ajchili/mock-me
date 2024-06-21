import Fastify from "fastify";
import FastifyWebSocket from "@fastify/websocket";
import {
  editorManagers,
  handler as rootWebsocketHandler,
} from "./handlers/root/webSocketHandler.js";

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
    wsHandler: rootWebsocketHandler,
  })
);

fastify.get("/selectDaily", async (req, res) => {
  const dailyQuestionResponse = await fetch(
    "https://alfa-leetcode-api.onrender.com/dailyQuestion"
  );
  const { data } = (await dailyQuestionResponse.json()) as any;
  const { content = "", codeSnippets = [] } =
    data?.activeDailyCodingChallengeQuestion?.question || {};

  editorManagers.prompt.value = content;
  editorManagers.response.value = codeSnippets.find(
    (codeSnippet: any) => codeSnippet.langSlug === "typescript"
  )?.code;

  res.status(200).send();
});

fastify.listen({ host: "0.0.0.0", port: 6969 });
