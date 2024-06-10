import Fastify from "fastify";
import FastifyWebSocket from "@fastify/websocket";

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
      socket.on("message", () => {
        socket.send("hello, world");
      });
    },
  })
);

fastify.listen({ port: 6969 });
