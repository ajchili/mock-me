import Fastify from "fastify";
import FastifyWebSocket from "@fastify/websocket";
import { EditorManager } from "./editorManager.js";

const candidateEditorManager = new EditorManager();

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
      socket.send(
        JSON.stringify({
          type: "editorValue",
          data: candidateEditorManager.value,
        })
      );

      candidateEditorManager.on("onChange", () => {
        socket.send(
          JSON.stringify({
            type: "editorValue",
            data: candidateEditorManager.value,
          })
        );
      });

      socket.on("message", (message: Buffer) => {
        const decodedMessage = Buffer.from(message).toString("utf-8");
        const { type, data } = JSON.parse(decodedMessage);
        switch (type) {
          case "changeCursorPosition":
            console.log(data.position.lineNumber + ":" + data.position.column);
            break;
          case "changeModelContent":
            candidateEditorManager.enqueueChanges(data.changes);
            break;
          default:
            console.log(type, JSON.stringify(data));
            break;
        }
      });
    },
  })
);

fastify.listen({ port: 6969 });
