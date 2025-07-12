import fastify from "fastify";
import { initCache, getLink, getRandom } from "./links.js";

const main = async () => {
  await initCache();
  const port = process.env.PORT || 8080;
  const server = fastify();

  server.setErrorHandler((err, _, reply) => {
    console.log(err);
    reply.status(500).send({ error: true });
  });

  process.on("uncaughtException", (err) => {
    console.log("Uncaught exception");
    console.log(err);
    // explicitly crash.
    process.exit(1);
  });

  server.get("/next", (request, response) => {
    const links = getLink(request.query.from);
    response.redirect(links.next.url, 302);
  });

  server.get("/previous", (request, response) => {
    const links = getLink(request.query.from);
    response.redirect(links.previous.url, 302);
  });

  server.get("/random", (_, response) => {
    const links = getRandom();
    response.redirect(links.previous.url, 302);
  });

  await server.listen({ port, host: "0.0.0.0" });
  console.log(`listening on port ${port}`);
};

main();
