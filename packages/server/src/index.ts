import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", (_request, response) => {
  response.status(200).send("Hello, world!");
});

fastify.listen({ port: 6969 });
