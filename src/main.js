import fs from "node:fs/promises";
import path from "node:path";
import fastify from "fastify";

const main = async () => {
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

  server.get("/webcomponent.js", async (_, response) => {
    response.header("Content-Type", "text/javascript");
    response.send(
      await fs.readFile(path.join(import.meta.dirname, "webcomponent.js")),
    );
  });

  server.get("*", (_, response) => {
    response.status(204);
    response.send();
  });

  await server.listen({ port, host: "0.0.0.0" });
  console.log(`listening on port ${port}`);

  process.on("SIGINT", () => {
    process.exit(0);
  });
};

main();
